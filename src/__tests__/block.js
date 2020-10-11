import {
  calculateChildrenWidth,
  getTotalWidth,
  rearrageChildren,
  rearrange,
  recalculateWidth,
} from "../block";
import { mockBlocks } from "../__mocks__/block";

const mockPadding = {
  x: 20,
  y: 20,
};

test("getTotalWidth returns total width of a children row for given block", () => {
  expect(getTotalWidth(mockBlocks, 0, mockPadding.x)).toBe(620);
  expect(getTotalWidth(mockBlocks, 1, mockPadding.x)).toBe(620);
  expect(getTotalWidth(mockBlocks, 2, mockPadding.x)).toBe(300);
  expect(getTotalWidth(mockBlocks, 3, mockPadding.x)).toBe(0);
  expect(getTotalWidth(mockBlocks, 4, mockPadding.x)).toBe(0);
});

test("calculateChildrenWidth returns the current width of children row for a given block", () => {
  const blocks = [mockBlocks[0]];
  expect(calculateChildrenWidth(blocks, mockBlocks[0], mockPadding.x)).toBe(0);
  const secondBlock = {
    parent: 0,
    childwidth: 0,
    id: 1,
    x: 274,
    y: 86,
    width: 200,
    height: 20,
  };
  blocks.push(secondBlock);
  expect(calculateChildrenWidth(blocks, mockBlocks[0], mockPadding.x)).toBe(
    220
  );
  const thirdBlock = { ...secondBlock, id: 2 };
  blocks.push(thirdBlock);
  expect(calculateChildrenWidth(blocks, mockBlocks[0], mockPadding.x)).toBe(
    440
  );
});

test("Rearrage children rearranges children of the block and updates the blocks", () => {
  document.querySelector = jest.fn(() => ({ style: { left: 0 } }));

  const blocks = [
    { parent: -1, childwidth: 0, id: 0, x: 386, y: 67, width: 200, height: 20 },
    { parent: 0, childwidth: 0, id: 1, x: 386, y: 107, width: 200, height: 20 },
  ];
  const data = rearrageChildren(blocks, blocks[0], 400, mockPadding.x);
  expect(data).toStrictEqual([
    { parent: -1, childwidth: 0, id: 0, x: 386, y: 67, width: 200, height: 20 },
    { parent: 0, childwidth: 0, id: 1, x: 286, y: 107, width: 200, height: 20 },
  ]);
});

test("recalculateWidth ", () => {
  const blocks = [
    {
      parent: -1,
      childwidth: 656,
      id: 0,
      x: 339,
      y: 166,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 0,
      id: 1,
      x: 170,
      y: 366,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 0,
      id: 2,
      x: 508,
      y: 366,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 1,
      id: 3,
      x: 170,
      y: 566,
      width: 318,
      height: 120,
    },
  ];
  expect(recalculateWidth(blocks, { id: 1 }, mockPadding.x, 318)).toStrictEqual(
    [
      {
        parent: -1,
        childwidth: 318,
        id: 0,
        x: 339,
        y: 166,
        width: 318,
        height: 120,
      },
      {
        childwidth: 318,
        parent: 0,
        id: 1,
        x: 170,
        y: 366,
        width: 318,
        height: 120,
      },
      {
        childwidth: 0,
        parent: 0,
        id: 2,
        x: 508,
        y: 366,
        width: 318,
        height: 120,
      },
      {
        childwidth: 0,
        parent: 1,
        id: 3,
        x: 170,
        y: 566,
        width: 318,
        height: 120,
      },
    ]
  );
});

test("rearrange function", () => {
  const before = [
    {
      parent: -1,
      childwidth: 318,
      id: 0,
      x: 328,
      y: 149,
      width: 318,
      height: 120,
    },
    {
      childwidth: 318,
      parent: 0,
      id: 1,
      x: 159,
      y: 349,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 0,
      id: 2,
      x: 497,
      y: 349,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 1,
      id: 3,
      x: 159,
      y: 549,
      width: 318,
      height: 120,
    },
  ];

  const after = [
    {
      parent: -1,
      childwidth: 656,
      id: 0,
      x: 328,
      y: 149,
      width: 318,
      height: 120,
    },
    {
      childwidth: 318,
      parent: 0,
      id: 1,
      x: 159,
      y: 349,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 0,
      id: 2,
      x: 497,
      y: 349,
      width: 318,
      height: 120,
    },
    {
      childwidth: 0,
      parent: 1,
      id: 3,
      x: 159,
      y: 549,
      width: 318,
      height: 120,
    },
  ];

  const canvas = document.createElement('div')
  expect(rearrange(before, canvas, mockPadding)).toStrictEqual(after);
});
