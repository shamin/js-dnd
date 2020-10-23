import { getCanvasElement, getStyles } from './dom';
import { Block, Padding, Arrow } from './types';

const generateArrowSvg = (arrowPath: string, pointerPath: string): SVGSVGElement => {
  const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  arrowSvg.setAttribute('fill', 'none');
  const arrowSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const pointerSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrowSvgPath.setAttribute('d', arrowPath);
  arrowSvgPath.setAttribute('stroke', '#000000');
  arrowSvgPath.setAttribute('stroke-width', '2px');
  pointerSvgPath.setAttribute('d', pointerPath);
  pointerSvgPath.setAttribute('fill', '#000000');
  arrowSvg.appendChild(arrowSvgPath);
  arrowSvg.appendChild(pointerSvgPath);
  return arrowSvg;
};

export function drawArrow(newBlock: Block, parent: Block, arrow: Arrow, padding: Padding) {
  const canvas = getCanvasElement();
  const arrowNode = document.createElement('div');
  arrowNode.setAttribute('data-arrowid', newBlock.id.toString());
  arrowNode.classList.add('arrow-block');

  let arrowSvg;
  if (arrow.x < 0) {
    arrowSvg = generateArrowSvg(
      `M${parent.x - newBlock.x + 5} 0L${parent.x - newBlock.x + 5} ${padding.y / 2}L5 ${padding.y / 2}L5 ${arrow.y}`,
      `M0 ${arrow.y - 5}H10L5 ${arrow.y}L0 ${arrow.y - 5}Z`,
    );
    arrowNode.style.left = newBlock.x - 5 + getStyles(canvas).rect.left + 'px';
  } else {
    arrowSvg = generateArrowSvg(
      `M20 0L20 ${padding.y / 2}L${arrow.x} ${padding.y / 2}L${arrow.x} ${arrow.y}`,
      `M${arrow.x - 5} ${arrow.y - 5}H${arrow.x + 5}L${arrow.x} ${arrow.y}L${arrow.x - 5} ${arrow.y - 5}Z`,
    );
    arrowNode.style.top = parent.x + parent.height / 2 + getStyles(canvas).rect.top + 'px';
  }
  arrowNode.appendChild(arrowSvg);
  canvas.appendChild(arrowNode);
}
