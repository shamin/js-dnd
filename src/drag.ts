import { snapNewChild } from './blocks';
import { createNewDomBlockNode, initDragListeners } from './dom';
import { Block, MousePos, Padding } from './types';
import { computeNewBlock } from './utils';

function getRelativeMousePosition(event: DragEvent, element: HTMLElement): MousePos {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
}

export function initDrag(canvas: HTMLElement, padding: Padding): void {
  let draggedElement: HTMLElement;
  let dragElementClickPosition: MousePos;
  let blocks: Block[] = [];

  function onDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    draggedElement = target;
    dragElementClickPosition = getRelativeMousePosition(event, draggedElement);

    target.classList.add('dragging');
  }

  function onDragEnter(element: HTMLElement): void {
    if (element.id === 'drag-area') {
      const parentBlock = element.parentElement.parentElement;
      parentBlock.classList.add('show-indicator');
    }
  }

  function onDragLeave(element: HTMLElement): void {
    if (element.id === 'drag-area') {
      const parentBlock = element.parentElement.parentElement;
      parentBlock.classList.remove('show-indicator');
    }
  }

  function onDrop(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const parentBlockElement = target.parentElement.parentElement;
    parentBlockElement.classList.remove('show-indicator');

    const parentBlockId = parseInt(parentBlockElement.getAttribute('data-blockid'));
    const parentBlock = blocks.find((b) => b.id === parentBlockId);

    const targetReleativeMousePostion = getRelativeMousePosition(event, canvas);

    if (blocks.length === 0) {
      const newNode = createNewDomBlockNode(draggedElement);
      newNode.setAttribute('data-blockid', '0');

      newNode.style.left = targetReleativeMousePostion.x - dragElementClickPosition.x + 'px';
      newNode.style.top = targetReleativeMousePostion.y - dragElementClickPosition.y + 'px';

      target.appendChild(newNode);
      blocks.push(computeNewBlock(newNode, -1));
    } else {
      if (target.id === 'drag-area') {
        blocks = snapNewChild(blocks, draggedElement, parentBlock, padding);
      }
    }
  }

  initDragListeners(onDragStart, onDragEnter, onDragLeave, onDrop);
}
