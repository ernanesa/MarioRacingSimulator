import CHARACTERS from './data/characters.js';
import { playRaceEngine } from './game/race.js';
import readline from 'node:readline';

async function listCharacters() {
  console.log("\n=============== Characters ===============");
  CHARACTERS.forEach((character, characterIndex) => {
    console.log(`${characterIndex + 1}. ${character.NAME} (Speed: ${character.SPEED}, Handling: ${character.MANEUVERABILITY}, Power: ${character.POWER})`);
  });
  console.log("=============== Characters ===============\n");
}

async function choosePlayers() {
  await listCharacters();
  let playerOneIndex;
  let playerTwoIndex;

  const readlineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const inputPlayerOne = await new Promise((resolve) => {
      readlineInterface.question('Enter number for Player 1: ', (input) => resolve(input));
    });
    const inputPlayerTwo = await new Promise((resolve) => {
      readlineInterface.question('Enter number for Player 2: ', (input) => resolve(input));
    });

    playerOneIndex = parseInt(inputPlayerOne, 10);
    playerTwoIndex = parseInt(inputPlayerTwo, 10);
    const isSelectionValid = Number.isInteger(playerOneIndex) && Number.isInteger(playerTwoIndex)
      && playerOneIndex > 0 && playerOneIndex <= CHARACTERS.length
      && playerTwoIndex > 0 && playerTwoIndex <= CHARACTERS.length
      && playerOneIndex !== playerTwoIndex;

    if (isSelectionValid) {
      readlineInterface.close();
      break;
    }
    console.log("Invalid selection. Choose two different valid numbers.");
  }

  const selectedPlayerOne = CHARACTERS[playerOneIndex - 1];
  const selectedPlayerTwo = CHARACTERS[playerTwoIndex - 1];
  console.log(`Selected: ${selectedPlayerOne.NAME} vs ${selectedPlayerTwo.NAME}`);

  return [playerOneIndex, playerTwoIndex];
}

async function menu() {
  console.log("\n=== Mario Racing Simulator ===");
  console.log("1) Show characters");
  console.log("2) Select players");
  console.log("3) Start race");
  console.log("0) Exit");
}

async function main() {
  let selectedPlayers = null;
  while (true) {
    await menu();
    const readlineInterface = readline.createInterface({ input: process.stdin, output: process.stdout });
    const menuChoice = await new Promise((resolve) => {
      readlineInterface.question('Select an option: ', (input) => {
        resolve(input);
        readlineInterface.close();
      });
    });

    if (menuChoice == 0) {
      console.clear();
      console.log("Bye Bye!");
      console.log("Was a pleasure to play with you !");
      break;
    } else if (menuChoice == 1) {
      console.clear();
      await listCharacters();
    } else if (menuChoice == 2) {
      console.clear();
      selectedPlayers = await choosePlayers();
    } else if (menuChoice == 3) {
      console.clear();
      if (!selectedPlayers) {
        console.log("\nPlease select players first !");
        selectedPlayers = await choosePlayers();
      }
      await playRaceEngine(
        CHARACTERS[selectedPlayers[0] - 1],
        CHARACTERS[selectedPlayers[1] - 1]
      );
    } else {
      console.clear();
      console.log("\nInvalid option !");
    }
  }
}

main();
