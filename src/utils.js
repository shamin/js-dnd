import { drawArrow } from "./arrow";
import {
  calculateChildrenWidth,
  rearrageChildren,
  rearrange,
  checkOffset,
  recalculateWidth,
} from "./block";
import {
  getBlockId,
  getBlockNodeWithId,
  getComputedStyle,
  windowScroll,
} from "./dom";

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

  console.log(parentBlock.x, totalWidth / 2 , totalRemove, getComputedStyle(newNode).width / 2, canvas.getBoundingClientRect().left)

  newNode.style.left =
    parentBlock.x -
    totalWidth / 2 +
    totalRemove +
    getComputedStyle(newNode).width / 2 -
    "px";
  newNode.style.top =
    parentBlock.y +
    parentBlock.height / 2 +
    padding.y +
    "px";

  const newBlockId = blocks.length;
  newNode.setAttribute("data-blockid", newBlockId);
  blocks.push(computeNewBlock(newNode, parentBlock.id, canvas));

  const arrowBlock = blocks.find((a) => a.id == newBlockId);
  const arrowX = arrowBlock.x - parentBlock.x + 20;
  const arrowY = padding.y;
  drawArrow(
    blocks,
    canvas,
    arrowBlock,
    arrowX,
    arrowY,
    parentBlock.id,
    padding,
    newBlockId
  );

  // Tested ok for all values
  blocks = recalculateWidth(blocks, parentBlock, padding.x, totalWidth);

  rearrange(blocks, canvas, padding);
  checkOffset(blocks, canvas);

  return blocks;
};

export const computeNewBlock = (element, parent, canvas) => {
  const elementDimen = getComputedStyle(element);
  return {
    parent,
    childwidth: 0,
    id: getBlockId(element),
    x:
      element.getBoundingClientRect().left +
      windowScroll().x +
      elementDimen.width / 2 +
      canvas.scrollLeft -
      canvas.getBoundingClientRect().left,
    y:
      element.getBoundingClientRect().top +
      windowScroll().y +
      elementDimen.height / 2 +
      canvas.scrollTop -
      canvas.getBoundingClientRect().top,
    width: elementDimen.width,
    height: elementDimen.height,
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
