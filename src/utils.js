export const creatNewBlock = (
  element,
  target,
  targetReleativeMousePostion,
  dragElementClickPosition,
  dataId = 0
) => {
  const newNode = element.cloneNode(true);
  newNode.classList.add("block");
  newNode.classList.remove("template");
  newNode.classList.remove("dragging");
  newNode.setAttribute("data-blockid", dataId);

  const dragAreaContainer = document.createElement("div");
  dragAreaContainer.classList.add("drag-area-container");
  const dragArea = document.createElement("div");
  dragArea.classList.add("drag-area");
  dragArea.setAttribute("id", "drag-area");
  dragAreaContainer.appendChild(dragArea);

  newNode.appendChild(dragAreaContainer);

  newNode.style.left = `${
    targetReleativeMousePostion.x - dragElementClickPosition.x
  }px`;
  newNode.style.top = `${
    targetReleativeMousePostion.y - dragElementClickPosition.y
  }px`;

  target.appendChild(newNode);
  return newNode;
};

export const moveBlock = (
  element,
  target,
  targetReleativeMousePostion,
  dragElementClickPosition
) => {
  element.style.left = `${
    targetReleativeMousePostion.x - dragElementClickPosition.x
  }px`;
  element.style.top = `${
    targetReleativeMousePostion.y - dragElementClickPosition.y
  }px`;

  target.appendChild(element);
};

export const snapNewBlock = (element, canvas, parentBlock, paddingY = 20) => {
  const newNode = element.cloneNode(true);
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

  canvas.appendChild(newNode);

  newNode.style.left =
    parentBlock.x - parseInt(window.getComputedStyle(newNode).width) / 2 + "px";
  newNode.style.top =
    parentBlock.y +
    parseInt(window.getComputedStyle(newNode).height) / 2 +
    paddingY +
    "px";

  return newNode;
};

export const computeNewBlock = (element, parent, canvas) => {
  const elementWidth = parseInt(window.getComputedStyle(element).width);
  const elementHeight = parseInt(window.getComputedStyle(element).height);
  return {
    parent,
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
