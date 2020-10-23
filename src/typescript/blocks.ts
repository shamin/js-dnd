import { createNewDomBlockNode, getBlockDomNode, getCanvasElement, getStyles } from './dom';
import { Block, Padding } from './types';
import { computeNewBlock, getBlockChildren, isFirstBlock } from './utils';

/*
  Traverse till the parent and updates each childWidth
*/
export function recalculateChildWidth(
  blocks: Block[],
  parent: Block,
  newChildrenWidth: number,
  padding: Padding,
): Block[] {
  const newBlocks = [...blocks];
  let curBlockId = parent.id;
  while (!isFirstBlock(blocks, curBlockId)) {
    let newChildWidth = 0;
    getBlockChildren(blocks, curBlockId).forEach((child) => {
      if (child.childWidth > child.width) {
        newChildWidth += child.childWidth + padding.x;
      } else {
        newChildWidth += child.width + padding.x;
      }
    });
    newBlocks.find((b) => b.id === curBlockId).childWidth = newChildWidth - padding.x; // Removing the padding from last child
    curBlockId = newBlocks.find((b) => b.id === curBlockId).parent;
  }
  newBlocks.find((b) => b.id === curBlockId).childWidth = newChildrenWidth;
  return newBlocks;
}

/*
  Returns the new width of children
*/
export function calculateChildrenWidth(blocks: Block[], parentId: number, padding: Padding) {
  let newChildrenWidth = 0;

  getBlockChildren(blocks, parentId).forEach((child) => {
    const childWidth = child.childWidth > child.width ? child.childWidth : child.width;
    newChildrenWidth += childWidth + padding.x;
  });
  // TODO: Need to add the new child width
  return newChildrenWidth;
}

/*
  Rearrages the current children of the parent
*/
export function rearrageChildren(
  blocks: Block[],
  parent: Block,
  newChildrenWidth: number,
  padding: Padding,
): { blocks: Block[]; usedWidth: number } {
  let usedWidth = 0;

  const children = getBlockChildren(blocks, parent.id);
  const firstChild = children[0];
  const newChildren = children.map((child) => {
    //TODO: Add dom updates if needed
    let newX;
    if (child.childWidth > child.width) {
      newX = firstChild.x - newChildrenWidth / 2 + usedWidth + child.childWidth / 2;
      usedWidth += child.childWidth + padding.x;
    } else {
      newX = firstChild.x - newChildrenWidth / 2 + usedWidth + child.width / 2;
      usedWidth += child.width + padding.x;
    }
    return {
      ...child,
      x: newX,
    };
  });

  return {
    blocks: blocks.map((b) => (b.parent !== parent.id ? b : newChildren.find((c) => c.id == b.id))),
    usedWidth,
  };
}

/*
  Setting childWidth as 0 for all end blocks
*/
export function cleanupEndBlocks(blocks: Block[]) {
  return blocks.map((block) =>
    blocks.filter((b) => b.parent === block.id).length === 0 ? { ...block, childWidth: 0 } : block,
  );
}

/*
  Repaint whole graph
*/
export function repaint(blocks: Block[], padding: Padding) {
  const canvas = getCanvasElement();

  blocks.forEach(({ parent }) => {
    if (parent === -1) {
      return;
    }

    const newChildrenWidth = calculateChildrenWidth(blocks, parent, padding) - padding.x; // Removing the padding from last child

    blocks.find((b) => b.id === parent).childWidth = newChildrenWidth;

    const parentBlock = blocks.find((b) => b.id === parent);

    let usedWidth = 0;

    getBlockChildren(blocks, parent).forEach((child) => {
      const blockDomNode = getBlockDomNode(child.id);
      blockDomNode.style.top = parentBlock.y + padding.y + canvas.getBoundingClientRect().top + 'px';
      if (child.childWidth > child.width) {
        blockDomNode.style.left =
          parentBlock.x -
          newChildrenWidth / 2 +
          usedWidth +
          child.childWidth / 2 -
          child.width / 2 -
          window.scrollX +
          canvas.getBoundingClientRect().left +
          'px';
        child.x = parentBlock.x - newChildrenWidth / 2 + usedWidth + child.childWidth / 2;

        usedWidth += child.childWidth + padding.x;
      } else {
        blockDomNode.style.left =
          parentBlock.x -
          newChildrenWidth / 2 +
          usedWidth -
          window.scrollX +
          canvas.getBoundingClientRect().left +
          'px';
        child.x = parentBlock.x - newChildrenWidth / 2 + usedWidth + child.width / 2;

        usedWidth += child.width + padding.x;
      }
    });
  });
}

/*
  Snaps a new block child with template to parent and return the new blocks
*/
export function snapNewChild(blocks: Block[], template: HTMLElement, parent: Block, padding: Padding) {
  const canvas = getCanvasElement();

  const newBlockNode = createNewDomBlockNode(template);
  canvas.appendChild(newBlockNode);

  const newChildrenWidth = calculateChildrenWidth(blocks, parent.id, padding) + getStyles(newBlockNode).width;
  let { blocks: newBlocks, usedWidth } = rearrageChildren(blocks, parent, newChildrenWidth, padding);
  //4. Set the new block left & top if needed

  newBlockNode.setAttribute('data-blockid', newBlocks.length.toString());

  newBlocks.push(computeNewBlock(newBlockNode, parent.id));

  newBlocks = recalculateChildWidth(newBlocks, parent, newChildrenWidth, padding);

  newBlocks = cleanupEndBlocks(blocks);
  repaint(newBlocks, padding);
  return newBlocks;
}
