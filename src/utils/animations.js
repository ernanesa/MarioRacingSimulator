import readline from 'node:readline';

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const hideCursor = () => process.stdout.write('\x1B[?25l');
const showCursor = () => process.stdout.write('\x1B[?25h');

async function spinner(labelText, durationMs = 600, frameIntervalMs = 80) {
  if (!process.stdout.isTTY) return;
  const brailleSpinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const endTimeMs = Date.now() + durationMs;
  hideCursor();
  let frameIndex = 0;
  while (Date.now() < endTimeMs) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${labelText} ${brailleSpinnerFrames[frameIndex % brailleSpinnerFrames.length]}`);
    frameIndex++;
    await sleep(frameIntervalMs);
  }
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  showCursor();
}

async function countdown() {
  if (!process.stdout.isTTY) return;
  hideCursor();
  for (const countdownLabel of ['3', '2', '1', 'GO!']) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Starting in ${countdownLabel}`);
    await sleep(1000);
  }
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  showCursor();
}

async function animateTrack(racerNameLeft, valueLeft, racerNameRight, valueRight, trackWidthUnits = 20, animationFrames = 18) {
  if (!process.stdout.isTTY) return;
  hideCursor();
  const maxValue = Math.max(valueLeft, valueRight, 1);
  for (let frame = 0; frame <= animationFrames; frame++) {
    const leftPositionUnits = Math.round((valueLeft / maxValue) * (frame / animationFrames) * trackWidthUnits);
    const rightPositionUnits = Math.round((valueRight / maxValue) * (frame / animationFrames) * trackWidthUnits);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${racerNameLeft.padEnd(12)} |${'='.repeat(leftPositionUnits)}🚗${' '.repeat(Math.max(0, trackWidthUnits - leftPositionUnits))}|\n`);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${racerNameRight.padEnd(12)} |${'='.repeat(rightPositionUnits)}🚗${' '.repeat(Math.max(0, trackWidthUnits - rightPositionUnits))}|\n`);
    await sleep(70);
    readline.moveCursor(process.stdout, 0, -2);
  }
  readline.moveCursor(process.stdout, 0, 2);
  showCursor();
}

export { spinner, countdown, animateTrack, sleep, hideCursor, showCursor };

process.on('exit', () => {
  try { showCursor(); } catch { }
});
process.on('SIGINT', () => {
  try { showCursor(); } catch { }
  process.exit(0);
});
