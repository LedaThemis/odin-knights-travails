import { knightMoves } from '..';

test('should start with initial position', () => {
  const initialPosition = [0, 0] as const;

  expect(knightMoves(initialPosition, [1, 2])[0]).toBe(initialPosition);
});

test('should return correct path (1)', () => {
  expect(knightMoves([0, 0], [1, 2]).length).toBe(2);
});

test('should return correct path (2)', () => {
  expect(knightMoves([0, 0], [3, 3]).length).toBe(3);
});

test('should return correct path (3)', () => {
  expect(knightMoves([3, 3], [0, 0]).length).toBe(3);
});

test('should return correct path (3)', () => {
  expect(knightMoves([3, 3], [4, 3]).length).toBe(4);
});
