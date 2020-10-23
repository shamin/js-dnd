import { getBlockIdFromElement, getCanvasElement, getStyles } from './dom';
import { Block } from './types';

export function isFirstBlock(blocks: Block[], blockId: number): boolean {
  return blocks.find((b) => b.id === blockId).parent === -1;
}

export function getBlockChildren(blocks: Block[], blockId: number): Block[] {
  return blocks.filter((b) => b.parent == blockId);
}

export function computeNewBlock(blockDomNode: HTMLElement, parent: number): Block {
  const canvas = getCanvasElement();
  const elementStyles = getStyles(blockDomNode);
  const canvasStyles = getStyles(canvas);
  return {
    parent,
    childWidth: 0,
    id: getBlockIdFromElement(blockDomNode),
    x: elementStyles.rect.left + elementStyles.width / 2 - canvasStyles.rect.left,
    y: elementStyles.rect.top + elementStyles.height / 2 - canvasStyles.rect.top,
    width: elementStyles.width,
    height: elementStyles.height,
  };
}
