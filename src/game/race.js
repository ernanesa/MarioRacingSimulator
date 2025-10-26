import blocks from '../constants/blocks.js';
import { spinner, countdown, animateTrack } from '../utils/animations.js';

async function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
  const randomRoll = Math.random();
  if (randomRoll < 0.33) return blocks.STRAIGHT;
  if (randomRoll < 0.66) return blocks.CURVE;
  return blocks.BATTLE;
}

async function logRollResult(racerName, trackBlockName, diceRollValue, attributeValue) {
  console.log(
    `${racerName} rolled the 🎲 of ${trackBlockName} with number ${diceRollValue} and attribute ${attributeValue}. Result ${diceRollValue + attributeValue}`
  );
}

async function playRaceEngine(racerOne, racerTwo) {
  console.log(`🏁 Race starting between ${racerOne.NAME} and ${racerTwo.NAME} 🏁`);
  await countdown();

  for (let round = 1; round <= 5; round++) {
    const roundNumber = round;
    console.log(`\n🏁 Round ${roundNumber} 🏁`);

    const trackBlock = await getRandomBlock();
    console.log(`Block: ${trackBlock}`);
    await spinner('Rolling dice');

    const diceResultPlayer1 = await rollDice();
    const diceResultPlayer2 = await rollDice();

    let totalSkillPlayer1 = 0;
    let totalSkillPlayer2 = 0;

    if (trackBlock === blocks.STRAIGHT) {
      totalSkillPlayer1 = diceResultPlayer1 + racerOne.SPEED;
      totalSkillPlayer2 = diceResultPlayer2 + racerTwo.SPEED;

      await logRollResult(racerOne.NAME, blocks.STRAIGHT, diceResultPlayer1, racerOne.SPEED);
      await logRollResult(racerTwo.NAME, blocks.STRAIGHT, diceResultPlayer2, racerTwo.SPEED);
      await animateTrack(racerOne.NAME, totalSkillPlayer1, racerTwo.NAME, totalSkillPlayer2);
    } else if (trackBlock === blocks.CURVE) {
      totalSkillPlayer1 = diceResultPlayer1 + racerOne.MANEUVERABILITY;
      totalSkillPlayer2 = diceResultPlayer2 + racerTwo.MANEUVERABILITY;

      await logRollResult(racerOne.NAME, blocks.CURVE, diceResultPlayer1, racerOne.MANEUVERABILITY);
      await logRollResult(racerTwo.NAME, blocks.CURVE, diceResultPlayer2, racerTwo.MANEUVERABILITY);
      await animateTrack(racerOne.NAME, totalSkillPlayer1, racerTwo.NAME, totalSkillPlayer2);
    } else if (trackBlock === blocks.BATTLE) {
      let totalSkillPlayer1 = diceResultPlayer1 + racerOne.POWER;
      let totalSkillPlayer2 = diceResultPlayer2 + racerTwo.POWER;

      console.log(`${racerOne.NAME} CONFRONTED ${racerTwo.NAME}! 🥊`);
      await logRollResult(racerOne.NAME, blocks.BATTLE, diceResultPlayer1, racerOne.POWER);
      await logRollResult(racerTwo.NAME, blocks.BATTLE, diceResultPlayer2, racerTwo.POWER);

      await spinner('Clashing');
      const visualBattleTotalPlayer1 = diceResultPlayer1 + racerOne.POWER;
      const visualBattleTotalPlayer2 = diceResultPlayer2 + racerTwo.POWER;
      await animateTrack(racerOne.NAME, visualBattleTotalPlayer1, racerTwo.NAME, visualBattleTotalPlayer2);

      if (totalSkillPlayer1 > totalSkillPlayer2) {
        console.log(`Round Winner: ${racerOne.NAME}.`);
        if (racerTwo.SCORE > 0) {
          racerTwo.SCORE--;
          console.log(`${racerTwo.NAME} lost 1 point. 🐢`);
        }
      } else if (totalSkillPlayer2 > totalSkillPlayer1) {
        console.log(`Round Winner: ${racerTwo.NAME}.`);
        if (racerOne.SCORE > 0) {
          racerOne.SCORE--;
          console.log(`${racerOne.NAME} lost 1 point. 🐢`);
        }
      } else if (totalSkillPlayer1 === totalSkillPlayer2) {
        console.log("Battle TIED. Nobody lost point.");
      }
    } else {
      console.log("Invalid option!");
    }

    if (totalSkillPlayer1 > totalSkillPlayer2) {
      console.log(`Round Winner: ${racerOne.NAME}. \nAdd 1 point.`);
      racerOne.SCORE++;
    } else if (totalSkillPlayer2 > totalSkillPlayer1) {
      console.log(`Round Winner: ${racerTwo.NAME}. \nAdd 1 point.`);
      racerTwo.SCORE++;
    } else {
      // tie - nothing for straight/curve
    }

    // small delay between rounds
    await new Promise((res) => setTimeout(res, 1000));
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

export { playRaceEngine };
