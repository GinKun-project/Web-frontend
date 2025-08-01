import { getAIIntent } from '../../src/app/game/aiLogic';

test('enemy chases player to the left', () => {
  const enemy = { position: { x: 500 } };
  const player = { position: { x: 400 } };
  expect(getAIIntent(enemy, player)).toEqual({ moveLeft: true, moveRight: false, shouldAttack: false });
});

test('enemy chases player to the right', () => {
  const enemy = { position: { x: 300 } };
  const player = { position: { x: 400 } };
  expect(getAIIntent(enemy, player)).toEqual({ moveLeft: false, moveRight: true, shouldAttack: false });
});

test('enemy attacks if close', () => {
  const enemy = { position: { x: 400 } };
  const player = { position: { x: 410 } };
  expect(getAIIntent(enemy, player)).toEqual(expect.objectContaining({ shouldAttack: true }));
});
