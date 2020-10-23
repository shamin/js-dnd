import { template } from '@babel/core';
import { snapNewChild } from './blocks';
import { initDragListeners } from './dom';
import { Block, Padding } from './types';

const getRelativeMousePosition = (event: DragEvent, element: HTMLElement) => {
  return {
    x: event.clientX - element.getBoundingClientRect().left,
    y: event.clientY - element.getBoundingClientRect().top,
  };
};

export function initDrag(canvas: HTMLElement, padding: Padding) {
  let draggedElement: HTMLElement;
  let dragElementClickPosition;
  let blocks: Block[] = [];

  function onDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    draggedElement = target;
    dragElementClickPosition = getRelativeMousePosition(event, draggedElement);

    target.classList.add('dragging');
  }

  function onDragEnter(element: HTMLElement) {
    if (element.id === 'drag-area') {
      const parentBlock = element.parentElement.parentElement;
      parentBlock.classList.add('show-indicator');
    }
  }

  function onDragLeave(element: HTMLElement) {
    if (element.id === 'drag-area') {
      const parentBlock = element.parentElement.parentElement;
      parentBlock.classList.remove('show-indicator');
    }
  }

  function onDrop(event: DragEvent) {
    const target = event.target as HTMLElement;
    const parentBlockElement = target.parentElement.parentElement;
    parentBlockElement.classList.remove('show-indicator');

    const parentBlockId = parseInt(parentBlockElement.getAttribute('data-blockid'));
    const parentBlock = blocks.find((b) => b.id === parentBlockId);

    const targetReleativeMousePostion = getRelativeMousePosition(event, canvas);

    blocks = snapNewChild(blocks, draggedElement, parentBlock, padding);
  }

  initDragListeners(onDragStart, onDragEnter, onDragLeave, onDrop);
}
