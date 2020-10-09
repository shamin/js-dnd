const getRelativeMousePosition = (event, element) => {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
};

const initFlow = (canvasId) => {
  let draggedElement;

  const canvas = document.getElementById(canvasId);

  let dragElementClickPosition = {};

  document.addEventListener("dragstart", (event) => {
    draggedElement = event.target;
    dragElementClickPosition = getRelativeMousePosition(event, draggedElement);
    event.target.classList.add("dragging");
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
      if (event.target.id === canvasId) {
        canvas.classList.add("highlight");
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

        const newNode = draggedElement.cloneNode(true);
        newNode.classList.add("block");
        newNode.classList.remove("template");
        newNode.classList.remove("dragging");

        const targetReleativeMousePostion = getRelativeMousePosition(
          event,
          canvas
        );

        newNode.style.left = `${
          targetReleativeMousePostion.x - dragElementClickPosition.x
        }px`;
        newNode.style.top = `${
          targetReleativeMousePostion.y - dragElementClickPosition.y
        }px`;

        event.target.appendChild(newNode);
      }
    },
    false
  );
};

export default initFlow;
