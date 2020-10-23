export interface Block {
  childWidth: number;
  parent: number;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Padding {
  x: number;
  y: number;
}

export interface ComputedStyle {
  rect: DOMRect;
  width: number;
  height: number;
}

export interface MousePos {
  x: number;
  y: number;
}
