import { ComputedStyle } from './types';

export function getBlockDomNode(id: number): HTMLElement {
  return document.querySelector('div[data-blockid="' + id + '"]');
}

export function getArrowDomNode(id: number): HTMLElement {
  return document.querySelector('div[data-arrowid="' + id + '"]');
}

export function getCanvasElement(): HTMLElement {
  return document.getElementById('canvas');
}

export function getBlockIdFromElement(blockDomNode: HTMLElement): number {
  return parseInt(blockDomNode.getAttribute('data-blockid'));
}

export function removeAllChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
}

export function getStyles(element: HTMLElement): ComputedStyle {
  const styles = window.getComputedStyle(element);
  return {
    rect: element.getBoundingClientRect(),
    width: parseInt(styles.width),
    height: parseInt(styles.height),
  };
}

export function createNewDomBlockNode(template: HTMLElement): HTMLElement {
  const newNode = template.cloneNode(true) as HTMLElement;
  newNode.classList.add('block');
  newNode.classList.remove('template');
  newNode.classList.remove('dragging');

  const dragAreaContainer = document.createElement('div');
  dragAreaContainer.classList.add('drag-area-container');
  const dragArea = document.createElement('div');
  dragArea.classList.add('drag-area');
  dragArea.setAttribute('id', 'drag-area');
  dragAreaContainer.appendChild(dragArea);

  newNode.appendChild(dragAreaContainer);

  return newNode;
}

export function initDragListeners(
  onDragStart: (e: DragEvent) => void,
  onDragEnter: (e: HTMLElement) => void,
  onDragLeave: (e: HTMLElement) => void,
  onDrop: (e: DragEvent) => void,
): void {
  document.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    target.classList.add('dragging');
    onDragStart(e);
  });
  document.addEventListener(
    'dragend',
    (e) => {
      const target = e.target as HTMLElement;
      target.classList.remove('dragging');
    },
    false,
  );
  document.addEventListener(
    'dragover',
    (e) => {
      e.preventDefault();
    },
    false,
  );
  document.addEventListener(
    'dragenter',
    (e) => {
      const target = e.target as HTMLElement;
      onDragEnter(target);
    },
    false,
  );
  document.addEventListener(
    'dragleave',
    (e) => {
      const target = e.target as HTMLElement;
      onDragLeave(target);
    },
    false,
  );
  document.addEventListener(
    'drop',
    (e) => {
      e.preventDefault();
      onDrop(e);
    },
    false,
  );
}

export function removeDomBlocksAndArrows(blocks: number[]): void {
  blocks.forEach((block) => {
    getBlockDomNode(block).remove();
    getArrowDomNode(block).remove();
  });
}
