import { getCanvasElement } from './dom';
import { Padding } from './types';
import { initDrag } from './drag';

function initFlow() {
  const padding: Padding = { x: 20, y: 20 };
  const canvas = getCanvasElement();

  initDrag(canvas, padding);
}

initFlow()