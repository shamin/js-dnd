import { getBlockNodeWithId } from "./dom";
import { updateArrow } from "./arrow";

export const getTotalWidth = (blocks, blockId, paddingX) => {
  const children = blocks.filter((b) => b.parent === blockId);
  return (
    children
      .map((child, index) => {
        const isChildParent =
          blocks.filter((b) => b.parent === child.id).length === 0;
        const childWidth = isChildParent ? 0 : child.childwidth;

        if (childWidth > child.width) {
          return children.length - 1 === index
            ? childWidth
            : childWidth + paddingX;
        }
        return children.length - 1 === index
          ? child.width
          : child.width + paddingX;
      })
      .reduce((a, c) => a + c, 0) || 0
  );
};

// Tested ok - except dom rendering
export const rearrange = (blocks, canvas, padding) => {
  blocks.forEach(({ parent }) => {
    if (parent === -1) {
      return;
    }
    const totalWidth = getTotalWidth(blocks, parent, padding.x);

    blocks.find((b) => b.id === parent).childwidth = totalWidth;

    let usedWidth = 0;
    blocks
      .filter((b) => b.parent === parent)
      .forEach((child) => {
        const childBlockNode = getBlockNodeWithId(child.id);
        const parentBlock = blocks.find((b) => b.id === parent);
        // TODO: Need to check whether it is needed
        // childBlockNode.style.top =
        //   parentBlock.y + padding.y + canvas.getBoundingClientRect().top + "px";
        // TODO: Need to check whether it is needed
        // parentBlock.y += padding.y;

        if (child.childwidth > child.width) {
          // TODO: Test this
          childBlockNode.style.left =
            parentBlock.x -
            totalWidth / 2 +
            usedWidth +
            child.childwidth / 2 -
            child.width / 2 +
            canvas.getBoundingClientRect().left +
            "px";

          child.x =
            parentBlock.x - totalWidth / 2 + usedWidth + child.childwidth / 2;
          usedWidth += child.childwidth + padding.x;
        } else {
          // TODO: Test this
          childBlockNode.style.left =
            parentBlock.x -
            totalWidth / 2 +
            usedWidth +
            canvas.getBoundingClientRect().left +
            "px";

          child.x =
            parentBlock.x - totalWidth / 2 + usedWidth + child.width / 2;
          usedWidth += child.width + padding.x;
        }
        // TODO: Arrow not tested
        const arrowBlock = blocks.find((a) => a.id == child.id);
        const arrowX = arrowBlock.x - parentBlock.x + 20;
        const arrowY = padding.y;
        updateArrow(blocks, canvas, arrowBlock, arrowX, arrowY, child, padding);
      });
  });

  return blocks;
};

// Tested ok for all values
export const recalculateWidth = (blocks, block, paddingX, totalwidth) => {
  const newBlocks = [...blocks];
  if (newBlocks.find((b) => b.id === block.id).parent !== -1) {
    let ourBlock = block.id;
    while (true) {
      if (newBlocks.find((b) => b.id === ourBlock).parent == -1) {
        break;
      } else {
        let zwidth = 0;
        const children = newBlocks.filter((b) => b.parent == ourBlock);
        children.forEach((child, index) => {
          if (child.childWidth > child.width) {
            zwidth +=
              index === children.length - 1
                ? child.childwidth
                : child.childwidth + paddingX;
          } else {
            zwidth +=
              index === children.length - 1
                ? child.width
                : child.width + paddingX;
          }
        });
        newBlocks.find((b) => b.id === ourBlock).childwidth = zwidth;
        ourBlock = newBlocks.find((b) => b.id == ourBlock).parent;
      }
    }
    newBlocks.find((b) => b.id == ourBlock).childwidth = totalwidth;
  }
  return newBlocks;
};

// Tested ok for all values
export const calculateChildrenWidth = (blocks, block, paddingX) => {
  let totalWidth = 0;
  blocks
    .filter((b) => b.parent == block.id)
    .forEach((child) => {
      if (child.childWidth > child.width) {
        totalWidth += child.childWidth + paddingX;
      } else {
        totalWidth += child.width + paddingX;
      }
    });
  return totalWidth;
};

export const checkOffset = (blocks, canvas) => {
  const offsets = blocks.map((block) => {
    return block.x - block.width / 2;
  });

  const minOffsetleft = Math.min.apply(Math, offsets); // Minimum offset left

  if (minOffsetleft < canvas.getBoundingClientRect().left) {
    blocks.forEach((block) => {
      const blockNode = getBlockNodeWithId(block.id);
      blockNode.style.left =
        block.x -
        block.width / 2 -
        minOffsetleft +
        canvas.getBoundingClientRect().left;
      block.x =
        blockNode.getBoundingClientRect().left +
        canvas.scrollLeft +
        parseInt(window.getComputedStyle(blockNode).width) / 2 -
        canvas.getBoundingClientRect().left;
    });
  }
};

// Hopefully won't be used
const checkAttach = (blocks, id, blockNode, paddingX) => {
  const xPos =
    blockNode.getBoundingClientRect().left +
    parseInt(window.getComputedStyle(blockNode).width) / 2 +
    canvas.scrollLeft -
    canvas.getBoundingClientRect().left;
  const yPos =
    blockNode.getBoundingClientRect().top +
    canvas.scrollTop -
    canvas.getBoundingClientRect().top;
  const block = blocks.find((b) => b.id === id);
  if (
    xPos >= block.x - block.width / 2 - paddingX &&
    xPos <= block.x + block.width / 2 + paddingX &&
    yPos <= block.y + block.checkAttach
  ) {
    return true;
  }
  return false;
};

// Tested ok - except dom rendering
export const rearrageChildren = (blocks, block, totalWidth, paddingX) => {
  let totalRemove = 0;
  const children = blocks.filter((b) => b.parent === block.id);
  const newChildren = children.map((child, index) => {
    const childBlockNode = getBlockNodeWithId(child.id);
    if (child.childwidth > child.width) {
      //Not tested
      childBlockNode.style.left =
        block.x -
        totalWidth / 2 +
        totalRemove +
        child.childwidth / 2 -
        child.width / 2 +
        "px";

      const newX = 0;
      children[0].x - totalWidth / 2 + totalRemove + child.childWidth / 2;

      totalRemove += child.childwidth + paddingX;
      return {
        ...child,
        x: newX,
      };
    }

    //Not tested
    childBlockNode.style.left = block.x - totalWidth / 2 + totalRemove + "px";
    const newX = children[0].x - totalWidth / 2 + totalRemove + child.width / 2;

    totalRemove += child.width + paddingX;
    return {
      ...child,
      x: newX,
    };
  });

  return {
    blocks: blocks.map((b) =>
      b.parent !== block.id ? b : newChildren.find((c) => c.id == b.id)
    ),
    totalRemove,
  };
};
