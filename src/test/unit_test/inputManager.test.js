import { getPlayerIntent } from '../../app/game/inputManager';

test('returns correct intent for move left', () => {
  const keys = { a: true };
  expect(getPlayerIntent(keys)).toEqual({ moveLeft: true, moveRight: false, attack: false });
});

test('returns correct intent for move right', () => {
  const keys = { d: true };
  expect(getPlayerIntent(keys)).toEqual({ moveLeft: false, moveRight: true, attack: false });
});

test('returns correct intent for attack', () => {
  const keys = { ' ': true };
  expect(getPlayerIntent(keys)).toEqual({ moveLeft: false, moveRight: false, attack: true });
});
