import { drawArrow, moveArrowOffset, updateArrow } from './arrow';
import { createNewDomBlockNode, getBlockDomNode, getCanvasElement, getStyles } from './dom';
import { Arrow, Block, Padding } from './types';
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
export function calculateChildrenWidth(blocks: Block[], parentId: number, padding: Padding): number {
  let newChildrenWidth = 0;

  getBlockChildren(blocks, parentId).forEach((child) => {
    const childWidth = child.childWidth > child.width ? child.childWidth : child.width;
    newChildrenWidth += childWidth + padding.x;
  });
  return newChildrenWidth;
}

/*
  Rearrages the current children of the parent
*/
export function rearrageChildren(blocks: Block[], parent: Block, newChildrenWidth: number, padding: Padding): Block[] {
  let usedWidth = 0;

  const children = getBlockChildren(blocks, parent.id);
  const firstChild = children[0];
  const newChildren = children.map((child) => {
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

  return blocks.map((b) => (b.parent !== parent.id ? b : newChildren.find((c) => c.id == b.id)));
}

/*
  Setting childWidth as 0 for all end blocks
*/
export function cleanupEndBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) =>
    blocks.filter((b) => b.parent === block.id).length === 0 ? { ...block, childWidth: 0 } : block,
  );
}

/*
  Repaint whole graph
*/
export function repaint(blocks: Block[], padding: Padding): Block[] {
  const newBlocks = [...blocks];

  newBlocks.forEach(({ parent }) => {
    if (parent === -1) {
      return;
    }

    const newChildrenWidth = calculateChildrenWidth(newBlocks, parent, padding) - padding.x; // Removing the padding from last child

    newBlocks.find((b) => b.id === parent).childWidth = newChildrenWidth;

    const parentBlock = newBlocks.find((b) => b.id === parent);

    let usedWidth = 0;

    getBlockChildren(newBlocks, parent).forEach((child) => {
      const blockDomNode = getBlockDomNode(child.id);
      const blockStyles = getStyles(blockDomNode);
      blockDomNode.style.top = parentBlock.y + padding.y + parentBlock.height / 2 + 'px';
      if (child.childWidth > child.width) {
        blockDomNode.style.left =
          parentBlock.x -
          newChildrenWidth / 2 +
          usedWidth +
          child.childWidth / 2 -
          child.width / 2 -
          window.scrollX +
          // canvas.getBoundingClientRect().left +
          'px';
        child.x = parentBlock.x - newChildrenWidth / 2 + usedWidth + child.childWidth / 2;
        usedWidth += child.childWidth + padding.x;
      } else {
        blockDomNode.style.left =
          parentBlock.x -
          newChildrenWidth / 2 +
          usedWidth -
          window.scrollX +
          // canvas.getBoundingClientRect().left +
          'px';
        child.x = parentBlock.x - newChildrenWidth / 2 + usedWidth + child.width / 2;
        usedWidth += child.width + padding.x;
      }

      const arrow: Arrow = {
        x: child.x - parentBlock.x + 20,
        y: padding.y,
      };
      updateArrow(parentBlock, arrow, child, padding);

      child.y = parentBlock.y + padding.y + parentBlock.height / 2 + blockStyles.height / 2;
    });
  });

  return newBlocks;
}

/*
  Snaps a new block child with template to parent and return the new blocks
*/
export function snapNewChild(blocks: Block[], template: HTMLElement, parent: Block, padding: Padding): Block[] {
  const canvas = getCanvasElement();

  const newBlockNode = createNewDomBlockNode(template);
  canvas.appendChild(newBlockNode);

  const newChildrenWidth = calculateChildrenWidth(blocks, parent.id, padding) + getStyles(newBlockNode).width;

  let newBlocks = rearrageChildren(blocks, parent, newChildrenWidth, padding);
  //4. Set the new block left & top if needed

  const newBlockId = newBlocks.length;
  newBlockNode.setAttribute('data-blockid', newBlockId.toString());

  newBlocks.push(computeNewBlock(newBlockNode, parent.id));

  const newBlock = newBlocks.find((a) => a.id === newBlockId);
  const arrow: Arrow = {
    x: newBlock.x - parent.x + 20,
    y: padding.y,
  };
  drawArrow(newBlock, parent, arrow, padding);

  newBlocks = recalculateChildWidth(newBlocks, parent, newChildrenWidth, padding);

  newBlocks = cleanupEndBlocks(newBlocks);
  newBlocks = repaint(newBlocks, padding);

  moveOffset(newBlocks);
  return newBlocks;
}

/*
  Move the flow to right as new blocks appear left
*/
function moveOffset(blocks: Block[]): Block[] {
  const newBlocks = [...blocks];
  const offsets = newBlocks.map((block) => {
    return block.x - block.width / 2;
  });

  const minOffsetleft = Math.min(...offsets);

  const canvas = getCanvasElement();

  if (minOffsetleft < getStyles(canvas).rect.left) {
    newBlocks.forEach((block) => {
      const blockNode = getBlockDomNode(block.id);
      blockNode.style.left = block.x - block.width / 2 - minOffsetleft + getStyles(canvas).rect.left + 20 + 'px';

      if (!isFirstBlock(newBlocks, block.id)) {
        const parentBlock = newBlocks.find((b) => b.id === block.parent);
        const arrow: Arrow = {
          x: block.x - parentBlock.x,
          y: 0,
        };
        moveArrowOffset(parentBlock, arrow, block, minOffsetleft);
      }
    });
    newBlocks.forEach((block) => {
      const blockNode = getBlockDomNode(block.id);
      block.x = getStyles(blockNode).rect.left + getStyles(blockNode).width / 2 - getStyles(canvas).rect.left;
    });
  }
  return newBlocks;
}
