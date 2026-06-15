/**
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

describe("dashboard.js", () => {
  let localStorageMock;
  const scriptContent = fs.readFileSync(
    path.resolve(__dirname, "../dashboard.js"),
    "utf8"
  );

  beforeEach(() => {
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

    delete window.open;
    window.open = jest.fn();

    delete window.prompt;
    window.prompt = jest.fn();
  });

  function setupAndLoad(orders) {
    localStorageMock.getItem.mockReturnValue(
      orders ? JSON.stringify(orders) : null
    );
    document.body.innerHTML = `<table><tbody id="ordersTable"></tbody></table>`;

    const sandbox = {
      document,
      window,
      localStorage: localStorageMock,
      JSON,
      prompt: window.prompt,
      console,
      encodeURIComponent,
    };
    vm.createContext(sandbox);
    vm.runInNewContext(scriptContent, sandbox);

    // Expose assignRider globally for tests
    if (sandbox.assignRider) {
      global.assignRider = sandbox.assignRider;
    }
  }

  describe("Orders Table Rendering", () => {
    it("should render order rows from localStorage", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
        { id: 2, name: "Bob", phone: "254700000002", pickup: "Karen", delivery: "Langata", price: 350 },
      ];
      setupAndLoad(orders);

      const rows = document.querySelectorAll("#ordersTable tr");
      expect(rows.length).toBe(2);
    });

    it("should display order name, pickup, delivery, and price in columns", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      const cells = document.querySelectorAll("#ordersTable tr td");
      expect(cells[0].textContent).toBe("Alice");
      expect(cells[1].textContent).toBe("CBD");
      expect(cells[2].textContent).toBe("Westlands");
      expect(cells[3].textContent).toBe("Ksh 200");
    });

    it("should render an Assign button for each order", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      const button = document.querySelector("#ordersTable button");
      expect(button).not.toBeNull();
      expect(button.textContent).toBe("Assign");
    });

    it("should render empty table when no orders in localStorage", () => {
      setupAndLoad(null);

      const rows = document.querySelectorAll("#ordersTable tr");
      expect(rows.length).toBe(0);
    });

    it("should clear existing table content before rendering", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(orders));
      document.body.innerHTML = `<table><tbody id="ordersTable"><tr><td>Old</td></tr></tbody></table>`;

      const sandbox = {
        document,
        window,
        localStorage: localStorageMock,
        JSON,
        prompt: window.prompt,
        console,
        encodeURIComponent,
      };
      vm.createContext(sandbox);
      vm.runInNewContext(scriptContent, sandbox);

      const rows = document.querySelectorAll("#ordersTable tr");
      expect(rows.length).toBe(1);
      expect(rows[0].textContent).not.toContain("Old");
    });
  });

  describe("assignRider", () => {
    it("should open WhatsApp link with rider number and order details", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      window.prompt.mockReturnValue("254712345678");
      assignRider(1);

      expect(window.open).toHaveBeenCalledTimes(1);
      const callArgs = window.open.mock.calls[0];
      expect(callArgs[0]).toContain("https://wa.me/254712345678");
      expect(callArgs[0]).toContain("Alice");
      expect(callArgs[0]).toContain("CBD");
      expect(callArgs[0]).toContain("Westlands");
      expect(callArgs[1]).toBe("_blank");
    });

    it("should update order status to 'Assigned' in localStorage", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      window.prompt.mockReturnValue("254712345678");
      assignRider(1);

      const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
      expect(savedData[0].status).toBe("Assigned");
    });

    it("should not open WhatsApp if prompt is cancelled", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      window.prompt.mockReturnValue(null);
      assignRider(1);

      expect(window.open).not.toHaveBeenCalled();
    });

    it("should not open WhatsApp if prompt returns empty string", () => {
      const orders = [
        { id: 1, name: "Alice", phone: "254700000001", pickup: "CBD", delivery: "Westlands", price: 200 },
      ];
      setupAndLoad(orders);

      window.prompt.mockReturnValue("");
      assignRider(1);

      expect(window.open).not.toHaveBeenCalled();
    });
  });
});
