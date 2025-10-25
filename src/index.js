const player1 = {
    NAME: "Mario",
    SPEED: 4,
    MANEUVERABILITY: 3,
    POWER: 3,
    SCORE: 0
}

const player2 = {
    NAME: "Luigi",
    SPEED: 3,
    MANEUVERABILITY: 4,
    POWER: 4,
    SCORE: 0
}

const blocks = {
    STRAIGHT: "STRAIGHT",
    CURVE: "CURVE",
    BATTLE: "BATTLE"
}

async function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock() {
    let random = Math.random()
    let result

    switch (true) {
        case random < 0.33:
            result = blocks.STRAIGHT;
            break;
        case random < 0.66:
            result = blocks.CURVE;
            break;
        default:
            result = blocks.BATTLE;
    }

    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} rolled the 🎲 of ${block} with number ${diceResult} and attribute ${attribute}. Result ${diceResult + attribute}`)
}

async function playRaceEngine(character1, character2) {
    for (let round = 1; round <= 5; round++) {
        console.log(`\n🏁 Round ${round} 🏁`)

        let block = await getRandomBlock();
        console.log(`Block: ${block}`)

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let totalTestSkill1 = 0;
        let totalTestSkill2 = 0;

        if (block === blocks.STRAIGHT) {
            totalTestSkill1 = diceResult1 + character1.SPEED;
            totalTestSkill2 = diceResult2 + character2.SPEED;

            await logRollResult(character1.NAME, blocks.STRAIGHT, diceResult1, character1.SPEED);
            await logRollResult(character2.NAME, blocks.STRAIGHT, diceResult2, character2.SPEED);
        }
        else if (block === blocks.CURVE) {
            totalTestSkill1 = diceResult1 + character1.MANEUVERABILITY;
            totalTestSkill2 = diceResult2 + character2.MANEUVERABILITY;

            await logRollResult(character1.NAME, blocks.CURVE, diceResult1, character1.MANEUVERABILITY);
            await logRollResult(character2.NAME, blocks.CURVE, diceResult2, character2.MANEUVERABILITY);
        }
        else if (block === blocks.BATTLE) {
            let totalTestSkill1 = diceResult1 + character1.POWER;
            let totalTestSkill2 = diceResult2 + character2.POWER;

            console.log(`${character1.NAME} CONFRONTED ${character2.NAME}! 🥊`)

            await logRollResult(character1.NAME, blocks.POWER, diceResult1, character1.POWER);
            await logRollResult(character2.NAME, blocks.POWER, diceResult2, character2.POWER);

            if (totalTestSkill1 > totalTestSkill2) {
                console.log(`Round Winner: ${character1.NAME}.`)

                if (character2.SCORE > 0) {
                    character2.SCORE--;
                    console.log(`${character2.NAME} losted 1 point. 🐢`)
                }
            }
            else if (totalTestSkill2 > totalTestSkill1) {
                console.log(`Round Winner: ${character2.NAME}.`)

                if (character1.SCORE > 0) {
                    character1.SCORE--;
                    console.log(`${character1.NAME} losted 1 point. 🐢`)
                }
            }
            else if (totalTestSkill1 === totalTestSkill2) {
                console.log("Battle TIED. Nobody lost point.")
            }
        }
        else {
            console.log("Invalid option!")
        }

        if (totalTestSkill1 > totalTestSkill2) {
            console.log(`Round Winner: ${character1.NAME}. \nAdd 1 point.`)
            character1.SCORE++;
        }
        else if (totalTestSkill2 > totalTestSkill1) {
            console.log(`Round Winner: ${character2.NAME}. \nAdd 1 point.`)
            character2.SCORE++;
        }
        else {
        }
    }

    console.log("\n---------------------\n")
    if (character1.SCORE > character2.SCORE) {
        console.log(`\Winner ${character1.NAME} 🏆.`)
        console.log(`${character1.NAME} score ${character1.SCORE}`)
        console.log(`${character2.NAME} score ${character2.SCORE}`)
    }
    else if (character2.SCORE > character1.SCORE) {
        console.log(`\nWinner ${character2.NAME} 🏆`)
        console.log(`${character2.NAME} score ${character2.SCORE}`)
        console.log(`${character1.NAME} score ${character1.SCORE}`)
    }
    else if (character2.SCORE === character1.SCORE) {
        console.log(`\nThe players ${character1.NAME} and ${character2.NAME} TIED with ${character1.SCORE} points.`)
    }
}

async function main() {
    console.log(`🏁 Race starting between ${player1.NAME} and ${player2.NAME} 🏁`)
    playRaceEngine(player1, player2)
}

main()

