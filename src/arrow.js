const { getArrowNodeWithId, removeAllChildren } = require("./dom");

const generateArrowSvg = (arrowPath, pointerPath) => {
  const arrowSvg = document.createElement("svg");
  arrowSvg.setAttribute("preserveaspectratio", "none");
  arrowSvg.setAttribute("fill", "none");
  arrowSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const arrowSvgPath = document.createElement("path");
  const pointerSvgPath = document.createElement("path");
  arrowSvgPath.setAttribute("d", arrowPath);
  arrowSvgPath.setAttribute("stroke", "#C5CCD0");
  arrowSvgPath.setAttribute("stroke-width", "2px");
  pointerSvgPath.setAttribute("d", pointerPath);
  pointerSvgPath.setAttribute("fill", "#C5CCD0");
  arrowSvg.appendChild(arrowSvgPath);
  arrowSvg.appendChild(pointerSvgPath);
  return arrowSvgPath;
};

export const drawArrow = (arrow, x, y, id) => {
  const arrowNode = document.createElement("div");
  arrowNode.setAttribute("data-arrowid", block.id);

  const block = blocks.find((b) => b.id == id);
  let arrowSvg;
  if (x < 0) {
    arrowSvg = generateArrowSvg(
      `M${block.x - arrow.x + 5}0L${block.x - arrow.x + 5} ${
        padding.y / 2
      } L5 ${padding.y / 2} L5 ${y}`,
      `M0 ${y - 5} H10L5 ${y} L0 ${y - 5}Z`
    );

    canvas.appendChild(arrowSvg);
    arrowSvg.style.left =
      arrow.x -
      5 -
      (absx + window.scrollX) +
      canvas.scrollLeft +
      canvas.getBoundiZngClientRect().left +
      "px";
  } else {
    arrowSvg = generateArrowSvg(
      `M20 0L20 ${paddingy / 2}L${x} ${paddingy / 2}L${x} ${y}`,
      `M${x - 5} ${y - 5}H${x + 5}L${x} ${y}L${x - 5} ${y - 5}Z`
    );
    canvas.appendChild(arrowSvg);
    arrowSvg.style.left =
      block.x -
      20 -
      (absx + window.scrollX) +
      canvas.scrollLeft +
      canvas.getBoundingClientRect().left +
      "px";
  }

  arrowSvg.style.top =
    block.y +
    block.height / 2 +
    canvas.getBoundingClientRect().top -
    absy +
    "px";
};

export const updateArrow = (arrow, x, y, block) => {
  const arrowNode = getArrowNodeWithId(block.id);
  removeAllChildren(arrowNode);

  if (x < 0) {
    arrowNode.style.left =
      arrow.x -
      5 -
      (absx + window.scrollX) +
      canvas.getBoundingClientRect().left +
      "px";
    const newArrowNodeChild = generateArrowSvg(
      `M${block.x - arrow.x + 5} 0L${block.x - arrow.x + 5} ${paddingy / 2}L5 ${
        paddingy / 2
      }L5 ${y}`,
      `M0 ${y - 5}H10L5 ${y}L0 ${y - 5}Z`
    );
    arrowNode.appendChild(newArrowNodeChild);
  } else {
    arrowNode.style.left =
      blocks.find((id) => id.id == block.parent).x -
      20 -
      (absx + window.scrollX) +
      canvas.getBoundingClientRect().left +
      "px";
    const newArrowNodeChild = generateArrowSvg(
      `M20 0L20 ${paddingy / 2}L${x} ${paddingy / 2}L${x} ${y}`,
      `M${x - 5} ${y - 5}H${x + 5}L${x} ${y}L${x - 5} ${y - 5}Z`
    );
    arrowNode.appendChild(newArrowNodeChild);
  }
};
