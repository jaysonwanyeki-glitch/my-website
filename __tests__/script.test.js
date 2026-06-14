/**
 * @jest-environment jsdom
 */

describe("script.js", () => {
  let localStorageMock;
  let domContentLoadedCallback;

  beforeEach(() => {
    document.body.innerHTML = "";
    document.body.className = "";

    localStorageMock = (() => {
      let store = {};
      return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = String(value); }),
        removeItem: jest.fn((key) => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; }),
      };
    })();
    Object.defineProperty(window, "localStorage", { value: localStorageMock, writable: true });

    // Intercept addEventListener to capture the DOMContentLoaded handler
    const originalAddEventListener = document.addEventListener.bind(document);
    jest.spyOn(document, "addEventListener").mockImplementation((event, cb) => {
      if (event === "DOMContentLoaded") {
        domContentLoadedCallback = cb;
      } else {
        originalAddEventListener(event, cb);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function loadScript() {
    jest.resetModules();
    require("../script.js");
    domContentLoadedCallback();
  }

  describe("Dark Mode Toggle", () => {
    beforeEach(() => {
      document.body.innerHTML = `<button id="darkModeToggle">Toggle</button>`;
    });

    it("should toggle dark class on body when button is clicked", () => {
      loadScript();
      const toggle = document.getElementById("darkModeToggle");

      toggle.click();
      expect(document.body.classList.contains("dark")).toBe(true);

      toggle.click();
      expect(document.body.classList.contains("dark")).toBe(false);
    });

    it("should save 'dark' theme to localStorage when toggling on", () => {
      loadScript();
      const toggle = document.getElementById("darkModeToggle");

      toggle.click();
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
    });

    it("should save 'light' theme to localStorage when toggling off", () => {
      loadScript();
      const toggle = document.getElementById("darkModeToggle");

      toggle.click(); // dark
      toggle.click(); // light
      expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "light");
    });

    it("should load saved dark theme from localStorage on page load", () => {
      localStorageMock.getItem.mockReturnValue("dark");
      loadScript();
      expect(document.body.classList.contains("dark")).toBe(true);
    });

    it("should not add dark class if theme is not 'dark' in localStorage", () => {
      localStorageMock.getItem.mockReturnValue("light");
      loadScript();
      expect(document.body.classList.contains("dark")).toBe(false);
    });

    it("should not throw if toggle button does not exist", () => {
      document.body.innerHTML = "";
      expect(() => loadScript()).not.toThrow();
    });
  });

  describe("Scroll Micro-Animations", () => {
    let mockObserve;
    let mockUnobserve;
    let observerCallback;

    beforeEach(() => {
      mockObserve = jest.fn();
      mockUnobserve = jest.fn();

      global.IntersectionObserver = jest.fn((callback) => {
        observerCallback = callback;
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: jest.fn(),
        };
      });
    });

    afterEach(() => {
      delete global.IntersectionObserver;
    });

    it("should set initial styles on .animate elements", () => {
      document.body.innerHTML = `
        <div class="animate">Item 1</div>
        <div class="animate">Item 2</div>
      `;
      loadScript();

      const items = document.querySelectorAll(".animate");
      items.forEach((item) => {
        expect(item.style.opacity).toBe("0");
        expect(item.style.transform).toBe("translateY(25px)");
        expect(item.style.transition).toBe("all 0.6s ease");
      });
    });

    it("should create an IntersectionObserver with threshold 0.15", () => {
      document.body.innerHTML = `<div class="animate">Item</div>`;
      loadScript();

      expect(global.IntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        { threshold: 0.15 }
      );
    });

    it("should observe all .animate elements", () => {
      document.body.innerHTML = `
        <div class="animate">Item 1</div>
        <div class="animate">Item 2</div>
        <div class="animate">Item 3</div>
      `;
      loadScript();

      expect(mockObserve).toHaveBeenCalledTimes(3);
    });

    it("should animate element when it intersects", () => {
      document.body.innerHTML = `<div class="animate">Item</div>`;
      loadScript();

      const item = document.querySelector(".animate");
      observerCallback([{ isIntersecting: true, target: item }]);

      expect(item.style.opacity).toBe("1");
      expect(item.style.transform).toBe("translateY(0)");
    });

    it("should unobserve element after it animates", () => {
      document.body.innerHTML = `<div class="animate">Item</div>`;
      loadScript();

      const item = document.querySelector(".animate");
      observerCallback([{ isIntersecting: true, target: item }]);

      expect(mockUnobserve).toHaveBeenCalledWith(item);
    });

    it("should not animate element when not intersecting", () => {
      document.body.innerHTML = `<div class="animate">Item</div>`;
      loadScript();

      const item = document.querySelector(".animate");
      observerCallback([{ isIntersecting: false, target: item }]);

      expect(item.style.opacity).toBe("0");
      expect(mockUnobserve).not.toHaveBeenCalled();
    });

    it("should not create observer if there are no .animate elements", () => {
      document.body.innerHTML = `<div>No animation</div>`;
      loadScript();

      expect(global.IntersectionObserver).not.toHaveBeenCalled();
    });
  });
});
