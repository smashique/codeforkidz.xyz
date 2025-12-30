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
        // ১. কনফেটি ইফেক্ট ট্রিগার
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2ff', '#ffffff', '#238636']
        });

        // ২. ফিডব্যাক মেসেজ
        gameContainer.innerHTML = `
            <div class="feedback correct">
                <h2 style="color: #00f2ff;">⚡ LOGIC VERIFIED!</h2>
                <p>OMEGA Score: ${engine.score}</p>
            </div>
        `;
        
        setTimeout(initGame, 1200); 
    } else {
        gameContainer.classList.add('shake');
        setTimeout(() => gameContainer.classList.remove('shake'), 500);
        // ভুল হলে রেড ভাইব
        const originalBg = gameContainer.style.borderColor;
        gameContainer.style.borderColor = 'red';
        setTimeout(() => gameContainer.style.borderColor = originalBg, 500);
    }
}
    initGame();
});
