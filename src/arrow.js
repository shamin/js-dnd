const { getArrowNodeWithId, removeAllChildren } = require("./dom");

const generateArrowSvg = (arrowPath, pointerPath) => {
  const arrowSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  arrowSvg.setAttribute("fill", "none");
  const arrowSvgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  const pointerSvgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  arrowSvgPath.setAttribute("d", arrowPath);
  arrowSvgPath.setAttribute("stroke", "#000000");
  arrowSvgPath.setAttribute("stroke-width", "2px");
  pointerSvgPath.setAttribute("d", pointerPath);
  pointerSvgPath.setAttribute("fill", "#000000");
  arrowSvg.appendChild(arrowSvgPath);
  arrowSvg.appendChild(pointerSvgPath);
  return arrowSvg;
};

export const drawArrow = (blocks, canvas, arrow, x, y, id, padding, newBlockId) => {
  const block = blocks.find((b) => b.id == id);

  const arrowNode = document.createElement("div");
  arrowNode.setAttribute("data-arrowid", newBlockId);
  arrowNode.classList.add('arrow-block');

  let arrowSvg;
  if (x < 0) {
    arrowSvg = generateArrowSvg(
      `M${block.x - arrow.x + 5}0L${block.x - arrow.x + 5} ${
        padding.y / 2
      } L5 ${padding.y / 2} L5 ${y}`,
      `M0 ${y - 5} H10L5 ${y} L0 ${y - 5}Z`
    );

    arrowNode.appendChild(arrowSvg);
    arrowNode.style.left =
      arrow.x -
      5 -
      // (absx + window.scrollX) +
      canvas.scrollLeft +
      canvas.getBoundiZngClientRect().left +
      "px";
  } else {
    arrowSvg = generateArrowSvg(
      `M20 0L20 ${padding.y / 2}L${x} ${padding.y / 2}L${x} ${y}`,
      `M${x - 5} ${y - 5}H${x + 5}L${x} ${y}L${x - 5} ${y - 5}Z`
    );
    arrowNode.appendChild(arrowSvg);
    arrowNode.style.left =
      block.x -
      20 -
      // (absx + window.scrollX) +
      canvas.scrollLeft +
      canvas.getBoundingClientRect().left +
      "px";
  }

  arrowNode.style.top =
    block.y +
    block.height / 2 +
    canvas.getBoundingClientRect().top +
    "px";

  canvas.appendChild(arrowNode);
};

export const updateArrow = (blocks, canvas, arrow, x, y, block, padding) => {
  const arrowNode = getArrowNodeWithId(block.id);
  console.log(arrowNode);
  if (arrowNode) {
    removeAllChildren(arrowNode);
  }

  if (x < 0) {
    arrowNode.style.left =
      arrow.x -
      5 -
      // (absx + window.scrollX) +
      canvas.getBoundingClientRect().left +
      "px";
    const newArrowNodeChild = generateArrowSvg(
      `M${block.x - arrow.x + 5} 0L${block.x - arrow.x + 5} ${
        padding.y / 2
      }L5 ${padding.y / 2}L5 ${y}`,
      `M0 ${y - 5}H10L5 ${y}L0 ${y - 5}Z`
    );
    arrowNode.appendChild(newArrowNodeChild);
  } else {
    arrowNode.style.left =
      blocks.find((id) => id.id == block.parent).x -
      20 -
      // (absx + window.scrollX) +
      canvas.getBoundingClientRect().left +
      "px";
    const newArrowNodeChild = generateArrowSvg(
      `M20 0L20 ${padding.y / 2}L${x} ${padding.y / 2}L${x} ${y}`,
      `M${x - 5} ${y - 5}H${x + 5}L${x} ${y}L${x - 5} ${y - 5}Z`
    );
    arrowNode.appendChild(newArrowNodeChild);
  }
};
