import initFlow from "../main";

const fireCustomEvent = (eventName, element, data = {}) => {
  const event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, true, true);
  event.eventName = eventName;
  Object.assign(event, data);
  element.dispatchEvent(event);
};

const generateDragElement = () => {
  const dragElement = document.createElement("div");
  dragElement.setAttribute("id", "template");
  dragElement.setAttribute("class", "template");
  dragElement.setAttribute("style", "width: 200px; height: 30px;");
  dragElement.getBoundingClientRect = jest.fn(() => ({
    width: 200,
    height: 30,
    top: 50,
    left: 50,
  }));
  return dragElement;
};

describe("Testing dragging events", () => {
  const canvas = document.createElement("div");
  const dragElement = generateDragElement();

  canvas.setAttribute("id", "canvas");
  canvas.getBoundingClientRect = jest.fn(() => ({
    width: 1000,
    height: 1000,
    top: 300,
    left: 0,
  }));

  document.body.appendChild(dragElement);
  document.body.appendChild(canvas);

  initFlow("canvas");

  test("drag start event sets dragging class to target element", () => {
    expect(dragElement.className).not.toContain("dragging");
    fireCustomEvent("dragstart", dragElement);
    expect(dragElement.className).toContain("dragging");
  });

  test("drag end event removes dragging class from target element", () => {
    expect(dragElement.className).toContain("dragging");
    fireCustomEvent("dragend", dragElement);
    expect(dragElement.className).not.toContain("dragging");
  });

  test("drag enter event adds highlight class to element if is triggered on canvas", () => {
    expect(canvas.className).not.toContain("highlight");
    fireCustomEvent("dragenter", canvas);
    expect(canvas.className).toContain("highlight");

    expect(dragElement.className).not.toContain("highlight");
    fireCustomEvent("dragenter", dragElement);
    expect(dragElement.className).not.toContain("highlight");
  });

  describe("drop event triggered on canvas", () => {
    test("removes highlight class", () => {
      expect(canvas.className).toContain("highlight");
      fireCustomEvent("drop", canvas);
      expect(canvas.className).not.toContain("highlight");
    });

    test("new block node is added to canvas", () => {
      expect(canvas.children.length).toBe(1);
      const child = canvas.children[0];
      expect(child.className).toContain("block");
      expect(child.className).not.toContain("template");
      expect(child.className).not.toContain("dragging");
    });

    test("dragging an existing element to canvas doesn't create a new block", () => {
      const initalCanvasChildren = canvas.children.length;
      const canvasDragElement = canvas.children[0];

      fireCustomEvent("dragstart", canvasDragElement);
      fireCustomEvent("drop", canvas);

      expect(canvas.children.length).toBe(initalCanvasChildren);
    });
  });

  describe("dragging second element", () => {
    test("dragging and dropping a new element to canvas does not create a new block", () => {
      expect(canvas.children.length).toBe(1);

      fireCustomEvent("dragstart", dragElement);
      fireCustomEvent("drop", canvas);

      expect(canvas.children.length).toBe(1);
    });

    test("dragging over a drag area shows an indicator on parent block", () => {
      const canvasBlockChild = canvas.children[0];
      expect(canvasBlockChild.className).not.toContain("show-indicator");
      fireCustomEvent(
        "dragenter",
        canvasBlockChild.querySelector("#drag-area")
      );
      expect(canvasBlockChild.className).toContain("show-indicator");
    });

    test("dragging and dropping over a drag area creates new block in canvas", () => {
      const initalCanvasChildren = canvas.children.length;
      const canvasBlockChild = canvas.children[0];
      fireCustomEvent("dragstart", dragElement);
      fireCustomEvent("drop", canvasBlockChild.querySelector("#drag-area"));
      expect(canvas.children.length).toBe(initalCanvasChildren + 1);
    });

    test("dragging an existing block to drag area doesn't create a new block", () => {
      const initalCanvasChildren = canvas.children.length;
      const canvasBlockFirstChild = canvas.children[0];
      const canvasBlockSecondChild = canvas.children[1];
      fireCustomEvent("dragstart", canvasBlockSecondChild);
      fireCustomEvent("drop", canvasBlockFirstChild.querySelector("#drag-area"));
      expect(canvas.children.length).toBe(initalCanvasChildren);
    });
  });
});
