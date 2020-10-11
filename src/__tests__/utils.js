import * as dom from "../dom";
import {
  creatNewBlock,
  moveBlock,
  snapNewBlock,
  computeNewBlock,
  createNewDomBlock,
} from "../utils";

test("creatNewBlock should attach and return a new block node", () => {
  const target = document.createElement("target");
  const element = document.createElement("template");
  const targetReleativeMousePostion = { x: 100, y: 100 };
  const dragElementClickPosition = { x: 5, y: 20 };
  const newNode = creatNewBlock(
    element,
    target,
    targetReleativeMousePostion,
    dragElementClickPosition
  );
  expect(target.children.length).toBe(1);

  expect(newNode.className).toContain("block");
  expect(newNode.className).not.toContain("template");
  expect(newNode.className).not.toContain("dragging");

  expect(newNode.style.left).toBe("95px");
  expect(newNode.style.top).toBe("80px");
  expect(newNode.querySelector("#drag-area")).not.toBeNull();
});

test("moveBlock should update the left and top styles", () => {
  const target = document.createElement("target");
  const element = document.createElement("template");
  const targetReleativeMousePostion = { x: 200, y: 200 };
  const dragElementClickPosition = { x: 5, y: 20 };

  moveBlock(
    element,
    target,
    targetReleativeMousePostion,
    dragElementClickPosition
  );

  expect(target.children.length).toBe(1);
  expect(target.children[0].style.left).toBe("195px");
  expect(target.children[0].style.top).toBe("180px");
});

test("snapNewBlock should attach a new block relative to parent and returns it", () => {
  const target = document.createElement("target");
  const element = document.createElement("template");
  const parentBlock = { x: 300, y: 100 };

  window.getComputedStyle = jest.fn(() => ({ width: 200, height: 30 }));

  const blocks = [
    { parent: -1, childwidth: 0, id: 0, x: 386, y: 67, width: 200, height: 20 },
    { parent: 0, childwidth: 0, id: 1, x: 386, y: 107, width: 200, height: 20 },
  ];

  document.querySelector = jest.fn(() => ({ style: { left: 0 } }));

  const newNode = snapNewBlock(element, target, parentBlock, 30, blocks);

  expect(target.children.length).toBe(1);
  expect(newNode.style.left).toBe("200px");
  expect(newNode.style.top).toBe("145px");
  expect(newNode.querySelector("#drag-area")).not.toBeNull();
});

test("computeNewBlock should compute block data from the block node element", () => {
  const mockDetails = {
    parent: 1,
    newBlockId: 2,
    height: 30,
    width: 200,
  };

  const target = document.createElement("target");
  const element = document.createElement("template");
  element.getBoundingClientRect = jest.fn(() => ({ left: 300, top: 150 }));
  element.setAttribute("data-blockid", 2);
  window.getComputedStyle = jest.fn(() => ({
    width: mockDetails.width,
    height: mockDetails.height,
  }));

  const blockData = computeNewBlock(element, mockDetails.parent, target);

  expect(blockData).toStrictEqual({
    parent: mockDetails.parent,
    childwidth: 0,
    id: mockDetails.newBlockId,
    height: mockDetails.height,
    width: mockDetails.width,
    x: 400,
    y: 165,
  });
});

test("createNewDomBlock creates a new dom element from template for block and returns it", () => {
  const template = document.createElement("div");
  template.classList.add("template");
  template.classList.add("dragging");
  const newNode = createNewDomBlock(template);
  expect(newNode.tagName.toLowerCase()).toBe("div");
  expect(newNode.className).toContain("block");
  expect(newNode.className).not.toContain("template");
  expect(newNode.className).not.toContain("dragging");
  expect(newNode.children.length).toBe(1);
  const dragAreaContainer = newNode.children[0];
  expect(dragAreaContainer.className).toBe("drag-area-container");
  expect(dragAreaContainer.children[0].className).toBe("drag-area");
  expect(dragAreaContainer.children[0].id).toBe("drag-area");
});
