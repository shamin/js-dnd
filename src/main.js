import {
  creatNewBlock,
  moveBlock,
  snapNewBlock,
  computeNewBlock,
} from "./utils";

const getRelativeMousePosition = (event, element) => {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
};

const initFlow = (canvasId) => {
  let blocks = [];

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
            blocks.push(computeNewBlock(newNode, -1, canvas));
          }
        } else {
          moveBlock(
            draggedElement,
            event.target,
            targetReleativeMousePostion,
            dragElementClickPosition
          );
        }
        rearrange = false;
      }

      if (event.target.id === "drag-area") {
        if (!rearrange) {
          const parentBlockElement = event.target.parentElement.parentElement;
          parentBlockElement.classList.remove("show-indicator");

          const parentBlockId = parseInt(
            parentBlockElement.getAttribute("data-blockid")
          );
          const parentBlock = blocks.find((b) => b.id === parentBlockId);

          const targetReleativeMousePostion = getRelativeMousePosition(
            event,
            canvas
          );

          blocks = snapNewBlock(
            draggedElement,
            canvas,
            parentBlock,
            { x: 20, y: 20 },
            blocks
          );
        }
      }
    },
    false
  );
};

export default initFlow;
