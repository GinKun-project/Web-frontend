import { rectangularCollision } from '../../infrastructure/canvas/collisionUtils';

// Mock canvas context
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    setTransform: jest.fn(),
    getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(4) })),
    measureText: jest.fn(() => ({ width: 0 })),
    fillText: jest.fn(),
    strokeText: jest.fn(),
  }))
};

describe('Game Logic - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rectangularCollision detects collision when boxes overlap', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
    const box2 = { position: { x: 30, y: 30 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision detects no collision when boxes are apart', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
    const box2 = { position: { x: 100, y: 100 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(false);
  });

  test('rectangularCollision handles edge touching correctly', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
    const box2 = { position: { x: 60, y: 10 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision handles negative dimensions', () => {
    const box1 = { position: { x: 0, y: 0 }, width: -100, height: 100 };
    const box2 = { position: { x: 50, y: 50 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(false);
  });

  test('rectangularCollision handles zero dimensions', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 0, height: 50 };
    const box2 = { position: { x: 30, y: 30 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(false);
  });

  test('rectangularCollision handles identical boxes', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
    const box2 = { position: { x: 10, y: 10 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision handles contained boxes', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 100, height: 100 };
    const box2 = { position: { x: 30, y: 30 }, width: 20, height: 20 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision handles boxes with decimal coordinates', () => {
    const box1 = { position: { x: 10.5, y: 10.5 }, width: 50, height: 50 };
    const box2 = { position: { x: 30.5, y: 30.5 }, width: 50, height: 50 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision handles very small boxes', () => {
    const box1 = { position: { x: 10, y: 10 }, width: 1, height: 1 };
    const box2 = { position: { x: 10, y: 10 }, width: 1, height: 1 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });

  test('rectangularCollision handles very large boxes', () => {
    const box1 = { position: { x: 0, y: 0 }, width: 1000, height: 1000 };
    const box2 = { position: { x: 500, y: 500 }, width: 1000, height: 1000 };
    expect(rectangularCollision(box1, box2)).toBe(true);
  });
}); 