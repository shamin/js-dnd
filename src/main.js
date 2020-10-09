const getRelativeMousePosition = (event, element) => {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
};

const creatNewBlock = (
  element,
  event,
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

  event.target.appendChild(newNode);
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
            creatNewBlock(
              draggedElement,
              event,
              targetReleativeMousePostion,
              dragElementClickPosition
            );
            blocks.push({
              id: 1,
            });
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
        const parentBlock = event.target.parentElement.parentElement;
        parentBlock.classList.remove("show-indicator");

        const targetReleativeMousePostion = getRelativeMousePosition(
          event,
          canvas
        );

        creatNewBlock(
          draggedElement,
          {target: canvas},
          targetReleativeMousePostion,
          dragElementClickPosition
        );

        blocks.push({
          id: 2,
        });
      }
    },
    false
  );
};

export default initFlow;
