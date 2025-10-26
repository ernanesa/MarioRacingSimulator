import blocks from '../constants/blocks.js';

export function rollDice(rng = Math.random) {
  return Math.floor(rng() * 6) + 1;
}

export function getRandomBlock(rng = Math.random) {
  const randomRoll = rng();
  if (randomRoll < 0.33) return blocks.STRAIGHT;
  if (randomRoll < 0.66) return blocks.CURVE;
  return blocks.BATTLE;
}

