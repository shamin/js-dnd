import initFlow from "../main";

const fireCustomEvent = (eventName, element, data = {}) => {
  const event = document.createEvent("HTMLEvents");
  event.initEvent(eventName, true, true);
  event.eventName = eventName;
  element.dispatchEvent(event);
};

describe("Testing dragging events", () => {
  const canvas = document.createElement("div");
  const dragElement = document.createElement("div");

  canvas.setAttribute("id", "canvas");
  dragElement.setAttribute("id", "template");
  dragElement.setAttribute("class", "template");

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

  describe("drop event triggered on canvs", () => {
    test("removes highlight class", () => {
      expect(canvas.className).toContain("highlight");
      fireCustomEvent("drop", canvas);
      expect(canvas.className).not.toContain("highlight");
    });

    test("new block node is added to canvas", () => {
      expect(canvas.children.length).toBeGreaterThan(0)
      const child = canvas.children[0]
      expect(child.className).toContain("block")
      expect(child.className).not.toContain("template")
      expect(child.className).not.toContain("dragging")
    })
  });
});
