const CHARACTERS = [
    { NAME: "Mario", SPEED: 4, MANEUVERABILITY: 3, POWER: 3, SCORE: 0 },
    { NAME: "Peach", SPEED: 3, MANEUVERABILITY: 4, POWER: 2, SCORE: 0 },
    { NAME: "Yoshi", SPEED: 2, MANEUVERABILITY: 4, POWER: 3, SCORE: 0 },
    { NAME: "Bowser", SPEED: 5, MANEUVERABILITY: 2, POWER: 5, SCORE: 0 },
    { NAME: "Luigi", SPEED: 3, MANEUVERABILITY: 4, POWER: 4, SCORE: 0 },
    { NAME: "Donkey Kong", SPEED: 2, MANEUVERABILITY: 2, POWER: 5, SCORE: 0 },
];


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
    console.log(`🏁 Race starting between ${character1.NAME} and ${character2.NAME} 🏁`)

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

        // add random delay between rounds
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1000);
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

async function listCharacteres() {
    console.log("\n=============== Characters ===============");
    CHARACTERS.forEach((character, index) => {
        console.log(`${index + 1}. ${character.NAME} (Speed: ${character.SPEED}, Handling: ${character.MANEUVERABILITY}, Power: ${character.POWER})`)
    })
    console.log("=============== Characters ===============\n");
}

async function choosePlayers() {
    listCharacteres();
    let player1;
    let player2;

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    while (true) {
        const choicePlayer1 = await new Promise((resolve) => {
            readline.question('Enter number for Player 1: ', (input) => {
                resolve(input);
            });
        });

        const choicePlayer2 = await new Promise((resolve) => {
            readline.question('Enter number for Player 2: ', (input) => {
                resolve(input);
            });
        });

        player1 = parseInt(choicePlayer1);
        player2 = parseInt(choicePlayer2);
        const isValid = Number.isInteger(player1) && Number.isInteger(player2)
            && player1 > 0 && player1 <= CHARACTERS.length
            && player2 > 0 && player2 <= CHARACTERS.length
            && player1 !== player2

        if (isValid) {
            readline.close();
            break;
        }
        console.log("Invalid selection. Choose two different valid numbers.");
    }
    const characterPlayer1 = CHARACTERS[player1 - 1];
    const characterPlayer2 = CHARACTERS[player2 - 1];
    console.log(`Selected: ${characterPlayer1.NAME} vs ${characterPlayer2.NAME}`)

    return [player1, player2];
}

async function menu() {
    console.log("\n=== Mario Racing Simulator ===");
    console.log("1) Show characters");
    console.log("2) Select players");
    console.log("3) Start race");
    console.log("0) Exit");
}

async function main() {
    let charactersSelecteds = null;
    while (true) {
        await menu();
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        var choice = await new Promise((resolve) => {
            readline.question('Select an option: ', (input) => {
                resolve(input);
                readline.close();
            });
        });

        if (choice == 0) {
            console.clear();
            console.log("Bye Bye!");
            console.log("Was a pleasure to play with you !");
            break;
        }
        else if (choice == 1) {
            console.clear();
            await listCharacteres();
        }
        else if (choice == 2) {
            console.clear();
            charactersSelecteds = await choosePlayers();
        }
        else if (choice == 3) {
            console.clear();
            // check if players are selected
            if (!charactersSelecteds) {
                console.log("\nPlease select players first !");
                charactersSelecteds = await choosePlayers();
            }

            await playRaceEngine(CHARACTERS[charactersSelecteds[0] - 1], CHARACTERS[charactersSelecteds[1] - 1])
        }
        else {
            console.clear();
            console.log("\nInvalid option !");
        }
    }
}

main()

