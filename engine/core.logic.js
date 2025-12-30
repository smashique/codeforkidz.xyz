// core.logic.js — Number Pattern Engine (MVP)


const GameEngine = (() => {
  let level = 1;
  let currentAnswer = null;

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generatePattern() {
    const start = random(1, 10);
    const step = random(1, 5);
    const pattern = [
      start,
      start + step,
      start + step * 2
    ];
    currentAnswer = start + step * 3;

    return {
      question: `${pattern.join(", ")}, ?`,
      options: shuffle([
        currentAnswer,
        currentAnswer + step,
        currentAnswer - step
      ])
    };
  }

  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function checkAnswer(value) {
    if (value === currentAnswer) {
      level++;
      return true;
    }
    return false;
  }

  function getLevel() {
    return level;
  }

  return { generatePattern, checkAnswer, getLevel };
})();
