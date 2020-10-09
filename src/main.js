const getRelativeMousePosition = (event, element) => {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
};

const creatNewBlock = (
  element,
  target,
  targetReleativeMousePostion,
  dragElementClickPosition
) => {
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

  newNode.style.left = `${
    targetReleativeMousePostion.x - dragElementClickPosition.x
  }px`;
  newNode.style.top = `${
    targetReleativeMousePostion.y - dragElementClickPosition.y
  }px`;

  target.appendChild(newNode);
  return newNode;
};

const moveBlock = (
  element,
  event,
  targetReleativeMousePostion,
  dragElementClickPosition
) => {
  element.style.left = `${
    targetReleativeMousePostion.x - dragElementClickPosition.x
  }px`;
  element.style.top = `${
    targetReleativeMousePostion.y - dragElementClickPosition.y
  }px`;

  event.target.appendChild(element);
};

const snapNewBlock = (
  element,
  canvas,
  targetReleativeMousePostion,
  dragElementClickPosition
) => {
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

  // left = parent.x

  newNode.style.left = `${
    targetReleativeMousePostion.x - dragElementClickPosition.x
  }px`;
  newNode.style.top = `${
    targetReleativeMousePostion.y - dragElementClickPosition.y
  }px`;

  canvas.appendChild(newNode);
};

const computeNewBlock = (element, parent, canvas) => {
  const elementWidth = parseInt(window.getComputedStyle(element).width);
  const elementHeight = parseInt(window.getComputedStyle(element).height);
  return {
    parent,
    childwidth: 0,
    id: 0,
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

const initFlow = (canvasId) => {
  const blocks = [];

  const spacingX = 100;
  const spacingY = 100;

  let draggedElement;

  const canvas = document.getElementById(canvasId);

  let dragElementClickPosition = {};
  let rearrange = false;

  document.addEventListener("dragstart", (event) => {
    draggedElement = event.target;
    dragElementClickPosition = getRelativeMousePosition(event, draggedElement);
    event.target.classList.add("dragging");

    const draggedElementParent = event.target.parentElement;
    if (draggedElementParent === canvas) {
      rearrange = true;
    }
  });

  document.addEventListener(
    "dragend",
    (event) => {
      event.target.classList.remove("dragging");
    },
    false
  );

  document.addEventListener(
    "dragover",
    (event) => {
      event.preventDefault();
    },
    false
  );

  document.addEventListener(
    "dragenter",
    (event) => {
      if (event.target.id === canvasId && blocks.length === 0) {
        canvas.classList.add("highlight");
      }
      if (event.target.id === "drag-area") {
        const parentBlock = event.target.parentElement.parentElement;
        parentBlock.classList.add("show-indicator");
      }
    },
    false
  );

  document.addEventListener(
    "dragleave",
    (event) => {
      if (event.target.id === canvasId) {
        canvas.classList.remove("highlight");
      }
      if (event.target.id === "drag-area") {
        const parentBlock = event.target.parentElement.parentElement;
        parentBlock.classList.remove("show-indicator");
      }
    },
    false
  );

  document.addEventListener(
    "drop",
    (event) => {
      event.preventDefault();
      if (event.target.id === canvasId) {
        canvas.classList.remove("highlight");

        const targetReleativeMousePostion = getRelativeMousePosition(
          event,
          canvas
        );

        if (!rearrange) {
          if (blocks.length === 0) {
            const newNode = creatNewBlock(
              draggedElement,
              event.target,
              targetReleativeMousePostion,
              dragElementClickPosition
            );
            blocks.push(computeNewBlock(newNode, parent, canvas));
          }
        } else {
          moveBlock(
            draggedElement,
            event,
            targetReleativeMousePostion,
            dragElementClickPosition
          );
        }
        rearrange = false;
      }

      if (event.target.id === "drag-area") {
        if (!rearrange) {
          const parentBlock = event.target.parentElement.parentElement;
          parentBlock.classList.remove("show-indicator");

          const targetReleativeMousePostion = getRelativeMousePosition(
            event,
            canvas
          );

          snapNewBlock(
            draggedElement,
            canvas,
            targetReleativeMousePostion,
            dragElementClickPosition
          );

          blocks.push({
            id: 2,
          });
        }
      }
    },
    false
  );
};

export default initFlow;
