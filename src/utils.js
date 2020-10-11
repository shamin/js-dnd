import {
  calculateChildrenWidth,
  rearrageChildren,
  rearrange,
  checkOffset,
  recalculateWidth,
} from "./block";
import { getBlockNodeWithId, getComputedStyle } from "./dom";

export const creatNewBlock = (
  element,
  target,
  targetReleativeMousePostion,
  dragElementClickPosition,
  dataId = 0
) => {
  const newNode = createNewDomBlock(element);
  newNode.setAttribute("data-blockid", dataId);

  newNode.style.left =
    targetReleativeMousePostion.x - dragElementClickPosition.x + "px";
  newNode.style.top =
    targetReleativeMousePostion.y - dragElementClickPosition.y + "px";

  target.appendChild(newNode);
  return newNode;
};

export const moveBlock = (
  element,
  target,
  targetReleativeMousePostion,
  dragElementClickPosition
) => {
  element.style.left =
    targetReleativeMousePostion.x - dragElementClickPosition.x + "px";
  element.style.top =
    targetReleativeMousePostion.y - dragElementClickPosition.y + "px";

  target.appendChild(element);
};

export const snapNewBlock = (
  template,
  canvas,
  parentBlock,
  padding,
  blocks
) => {
  const newNode = createNewDomBlock(template);

  canvas.appendChild(newNode);

  // Tested ok except some dom stuffs
  const output = manageSnap(blocks, parentBlock);
  blocks = output.blocks;
  const { totalWidth, totalRemove } = output;

  newNode.style.left =
    parentBlock.x -
    totalWidth / 2 +
    totalRemove +
    getComputedStyle(newNode).width / 2 -
    canvas.getBoundingClientRect().left +
    "px";
  newNode.style.top =
    parentBlock.y +
    parentBlock.height / 2 +
    padding.y +
    canvas.getBoundingClientRect().top +
    "px";

  newNode.setAttribute("data-blockid", blocks.length);
  blocks.push(computeNewBlock(newNode, parentBlock.id, canvas));

  // Tested ok for all values
  blocks = recalculateWidth(blocks, parentBlock, padding.x, totalWidth);

  rearrange(blocks, canvas, padding);
  checkOffset(blocks, canvas);

  return blocks;
};

export const computeNewBlock = (element, parent, canvas, childwidth = 0) => {
  const elementWidth = getComputedStyle(element).width;
  const elementHeight = getComputedStyle(element).height;
  return {
    parent,
    childwidth,
    id: parseInt(element.getAttribute("data-blockid")),
    x:
      element.getBoundingClientRect().left +
      elementWidth / 2 -
      canvas.getBoundingClientRect().left,
    y:
      element.getBoundingClientRect().top +
      elementHeight / 2 -
      canvas.getBoundingClientRect().top,
    width: elementWidth,
    height: elementHeight,
  };
};

const manageSnap = (blocks, block) => {
  const paddingX = 0;
  //Tested okay
  let totalWidth = calculateChildrenWidth(blocks, block, paddingX);
  const blockNode = getBlockNodeWithId(block.id);
  //Need to test in UI
  totalWidth += getComputedStyle(blockNode).width;

  //Tested okay except dom render
  return {
    ...rearrageChildren(blocks, block, totalWidth, paddingX),
    totalWidth,
  };
};

export const createNewDomBlock = (template) => {
  const newNode = template.cloneNode(true);
  newNode.classList.add("block");
  newNode.classList.remove("template");
  newNode.classList.remove("dragging");

  const dragAreaContainer = document.createElement("div");
  dragAreaContainer.classList.add("drag-area-container");
  const dragArea = document.createElement("div");
  dragArea.classList.add("drag-area");
  dragArea.setAttribute("id", "drag-area");
  dragAreaContainer.appendChild(dragArea);

  newNode.appendChild(dragAreaContainer);

  return newNode;
};
