// core.logic.js — Unlimited Number/Operator Pattern Engine

const GameEngine = (() => {
  let level = 1;
  let currentAnswer = null;

  const operators = ["+", "-"]; // initially
  const maxOptions = 3;

  function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickOperator() {
    if (level >= 5 && !operators.includes("*")) operators.push("*");
    if (level >= 10 && !operators.includes("/")) operators.push("/");
    return operators[random(0, operators.length - 1)];
  }

  function generatePattern() {
    const length = 3 + Math.floor(level / 2);
    let start = random(1, 10);
    let step = random(1 + Math.floor(level / 3), 5 + Math.floor(level / 2));
    let pattern = [start];

    for (let i = 1; i < length; i++) {
      const op = pickOperator();
      let next;
      switch (op) {
        case "+": next = pattern[i - 1] + step; break;
        case "-": next = pattern[i - 1] - step; break;
        case "*": next = pattern[i - 1] * step; break;
        case "/": 
          next = Math.floor(pattern[i - 1] / step) || 1; 
          break;
      }
      pattern.push(next);
    }

    currentAnswer = pattern[pattern.length - 1];

    // Generate options (correct + distractors)
    let options = [currentAnswer];
    while (options.length < maxOptions) {
      let delta = random(1, Math.floor(step * 2));
      let distractor = (Math.random() < 0.5) ? currentAnswer + delta : currentAnswer - delta;
      if (!options.includes(distractor)) options.push(distractor);
    }

    return {
      question: `${pattern.slice(0, pattern.length - 1).join(", ")}, ?`,
      options: shuffle(options)
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
