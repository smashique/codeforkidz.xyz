import { engine } from '../engine/core.logic.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('player-score');
    const levelDisplay = document.getElementById('game-level');

    function initGame() {
        const data = engine.generatePattern();
        renderPattern(data);
    }

    function renderPattern(data) {
        scoreDisplay.innerText = `Score: ${engine.score}`;
        levelDisplay.innerText = `Level: ${engine.level}`;

        gameContainer.innerHTML = `
            <div class="algorithm-card">
                <div class="pattern-box">
                    ${data.sequence.map(num => `<span class="num">${num}</span>`).join(' <span class="arrow">→</span> ')}
                    <span class="num target">?</span>
                </div>
                <div class="options-grid">
                    ${data.options.map(opt => `
                        <button class="option-btn" data-value="${opt}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        // বাটন ক্লিকে উত্তর চেক করা
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selected = e.target.getAttribute('data-value');
                handleSubmission(selected, data.correctAnswer);
            });
        });
    }

    function handleSubmission(userAnswer, correctAnswer) {
        const isCorrect = engine.validateAnswer(userAnswer, correctAnswer);
        
        if (isCorrect) {
            gameContainer.innerHTML = `<div class="feedback correct">CORE LOGIC MATCHED! NEXT LEVEL...</div>`;
            setTimeout(initGame, 1000); // ১ সেকেন্ড পর পরের লেভেল
        } else {
            gameContainer.classList.add('shake');
            setTimeout(() => gameContainer.classList.remove('shake'), 500);
            alert("Logic Error: Try Again!");
        }
    }

    initGame();
});
