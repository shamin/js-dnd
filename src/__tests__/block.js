import { getTotalWidth, getTotalWidth2 } from "../block";
import { mockBlocks } from "../__mocks__/block";

test("getTotalWidth returns total width of a children row for given block", () => {
  expect(getTotalWidth(mockBlocks, 0, 20)).toBe(620);
  expect(getTotalWidth(mockBlocks, 1, 20)).toBe(620);
  expect(getTotalWidth(mockBlocks, 2, 20)).toBe(300);
  expect(getTotalWidth(mockBlocks, 3, 20)).toBe(0);
  expect(getTotalWidth(mockBlocks, 4, 20)).toBe(0);
});
