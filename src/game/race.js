import blocks from '../constants/blocks.js';
import { spinner, countdown, animateTrack, sleep } from '../utils/animations.js';
import { rollDice, getRandomBlock } from '../utils/random.js';

function logRollResult(racerName, trackBlockName, diceRollValue, attributeValue) {
  console.log(
    `${racerName} rolled the 🎲 of ${trackBlockName} with number ${diceRollValue} and attribute ${attributeValue}. Result ${diceRollValue + attributeValue}`
  );
}

function getAttributeForBlock(racer, trackBlock) {
  if (trackBlock === blocks.STRAIGHT) return racer.SPEED;
  if (trackBlock === blocks.CURVE) return racer.MANEUVERABILITY;
  if (trackBlock === blocks.BATTLE) return racer.POWER;
  return 0;
}

export async function playRaceEngine(racerOne, racerTwo) {
  console.log(`🏁 Race starting between ${racerOne.NAME} and ${racerTwo.NAME} 🏁`);
  await countdown();

  for (let round = 1; round <= 5; round++) {
    console.log(`\n🏁 Round ${round} 🏁`);

    const trackBlock = getRandomBlock();
    console.log(`Block: ${trackBlock}`);
    await spinner('Rolling dice');

    const diceResultPlayer1 = rollDice();
    const diceResultPlayer2 = rollDice();

    let totalSkillPlayer1 = 0;
    let totalSkillPlayer2 = 0;

    if (trackBlock === blocks.BATTLE) {
      // Battle branch handled separately (no +1 award, only -1 to loser)
      const battleTotal1 = diceResultPlayer1 + getAttributeForBlock(racerOne, trackBlock);
      const battleTotal2 = diceResultPlayer2 + getAttributeForBlock(racerTwo, trackBlock);

      console.log(`${racerOne.NAME} CONFRONTED ${racerTwo.NAME}! 🥊`);
      logRollResult(racerOne.NAME, blocks.BATTLE, diceResultPlayer1, racerOne.POWER);
      logRollResult(racerTwo.NAME, blocks.BATTLE, diceResultPlayer2, racerTwo.POWER);

      await spinner('Clashing');
      await animateTrack(racerOne.NAME, battleTotal1, racerTwo.NAME, battleTotal2);

      if (battleTotal1 > battleTotal2) {
        console.log(`Round Winner: ${racerOne.NAME}.`);
        if (racerTwo.SCORE > 0) {
          racerTwo.SCORE--;
          console.log(`${racerTwo.NAME} lost 1 point. 🐢`);
        }
      } else if (battleTotal2 > battleTotal1) {
        console.log(`Round Winner: ${racerTwo.NAME}.`);
        if (racerOne.SCORE > 0) {
          racerOne.SCORE--;
          console.log(`${racerOne.NAME} lost 1 point. 🐢`);
        }
      } else {
        console.log("Battle TIED. Nobody lost point.");
      }
      await sleep(1000);
      continue;
    }

    const attr1 = getAttributeForBlock(racerOne, trackBlock);
    const attr2 = getAttributeForBlock(racerTwo, trackBlock);
    totalSkillPlayer1 = diceResultPlayer1 + attr1;
    totalSkillPlayer2 = diceResultPlayer2 + attr2;

    logRollResult(racerOne.NAME, trackBlock, diceResultPlayer1, attr1);
    logRollResult(racerTwo.NAME, trackBlock, diceResultPlayer2, attr2);
    await animateTrack(racerOne.NAME, totalSkillPlayer1, racerTwo.NAME, totalSkillPlayer2);

    if (totalSkillPlayer1 > totalSkillPlayer2) {
      console.log(`Round Winner: ${racerOne.NAME}. \nAdd 1 point.`);
      racerOne.SCORE++;
    } else if (totalSkillPlayer2 > totalSkillPlayer1) {
      console.log(`Round Winner: ${racerTwo.NAME}. \nAdd 1 point.`);
      racerTwo.SCORE++;
    }

    // small delay between rounds
    await sleep(1000);
  }

  console.log("\n---------------------\n");
  if (racerOne.SCORE > racerTwo.SCORE) {
    console.log(`\nWinner ${racerOne.NAME} 🏆.`);
    console.log(`${racerOne.NAME} score ${racerOne.SCORE}`);
    console.log(`${racerTwo.NAME} score ${racerTwo.SCORE}`);
  } else if (racerTwo.SCORE > racerOne.SCORE) {
    console.log(`\nWinner ${racerTwo.NAME} 🏆`);
    console.log(`${racerTwo.NAME} score ${racerTwo.SCORE}`);
    console.log(`${racerOne.NAME} score ${racerOne.SCORE}`);
  } else if (racerTwo.SCORE === racerOne.SCORE) {
    console.log(`\nThe players ${racerOne.NAME} and ${racerTwo.NAME} TIED with ${racerOne.SCORE} points.`);
  }
}

