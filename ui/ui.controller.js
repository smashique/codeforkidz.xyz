// ui.controller.js — UI Handler

const UIController = (() => {
  const container = document.getElementById("game-container");

  function renderGame() {
    const data = GameEngine.generatePattern();

    container.innerHTML = `
      <h2>Level ${GameEngine.getLevel()}</h2>
      <p><strong>${data.question}</strong></p>
      <div>
        ${data.options.map(opt =>
          `<button onclick="UIController.submit(${opt})">${opt}</button>`
        ).join("")}
      </div>
      <p id="feedback"></p>
    `;
  }

  function submit(value) {
    const feedback = document.getElementById("feedback");
    if (GameEngine.checkAnswer(value)) {
      feedback.innerHTML = "🎉 Correct! Next Level...";
      setTimeout(renderGame, 800);
    } else {
      feedback.innerHTML = "😅 Wrong! Try again.";
    }
  }

  return { renderGame, submit };
})();

UIController.renderGame();
