import { rectangularCollision } from '../../infrastructure/canvas/collisionUtils';

test('detects collision when boxes overlap', () => {
  const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
  const box2 = { position: { x: 30, y: 30 }, width: 50, height: 50 };
  expect(rectangularCollision(box1, box2)).toBe(true);
});

test('detects no collision when boxes are apart', () => {
  const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
  const box2 = { position: { x: 100, y: 100 }, width: 50, height: 50 };
  expect(rectangularCollision(box1, box2)).toBe(false);
});

test('collision with edge touching', () => {
  const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
  const box2 = { position: { x: 60, y: 10 }, width: 50, height: 50 };
  expect(rectangularCollision(box1, box2)).toBe(true); // edges touching is considered collision
});

test('collision with negative width', () => {
  const box1 = { position: { x: 0, y: 0 }, width: -100, height: 100 };
  const box2 = { position: { x: 50, y: 50 }, width: 50, height: 50 };
  expect(rectangularCollision(box1, box2)).toBe(false);
});
