import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('player-score');

    // ধাপ ১: প্লেয়ার সংখ্যা নির্বাচন করার মেনু
    function showPlayerSelection() {
        gameContainer.innerHTML = `
            <div class="setup-box">
                <h2>SELECT PLAYERS</h2>
                <div class="selection-grid">
                    <button class="select-btn" data-players="1">1 Player</button>
                    <button class="select-btn" data-players="2">2 Players</button>
                    <button class="select-btn" data-players="3">3 Players</button>
                    <button class="select-btn" data-players="4">4 Players</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.onclick = () => {
                const count = parseInt(btn.dataset.players);
                engine.initPlayers(count); 
                initGame();
            };
        });
    }

    function initGame() {
        const data = engine.generatePattern();
        renderPattern(data);
    }

    function renderPattern(data) {
        scoreDisplay.innerHTML = engine.players.map(p => 
            `<span class="p-score ${p.id - 1 === engine.currentPlayerIndex ? 'active' : ''}">
                P${p.id}: ${p.score}
            </span>`
        ).join(' | ');

        gameContainer.innerHTML = `
            <div class="turn-indicator">PLAYER ${data.currentPlayer.id}'S TURN</div>
            <div class="algorithm-card">
                <div class="pattern-box">
                    ${data.sequence.join(' → ')} → <span class="target">?</span>
                </div>
                <div class="options-grid">
                    ${data.options.map(opt => `
                        <button class="option-btn" data-value="${opt}">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => handleSubmission(btn.dataset.value, data.correctAnswer);
        });
    }

    function handleSubmission(userAnswer, correctAnswer) {
        const isCorrect = engine.validateAnswer(userAnswer, correctAnswer);
        
        if (isCorrect) {
            // ওমেগা সাউন্ড কল: সঠিক
            soundEngine.playCorrect();
            
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70 });
            gameContainer.innerHTML = `<div class="feedback correct">⚡ CORRECT! PLAYER ${engine.currentPlayerIndex + 1} SCORED!</div>`;
        } else {
            // ওমেগা সাউন্ড কল: ভুল
            soundEngine.playWrong();
            
            gameContainer.innerHTML = `<div class="feedback wrong">❌ LOGIC ERROR! NEXT PLAYER...</div>`;
            gameContainer.classList.add('shake');
            setTimeout(() => gameContainer.classList.remove('shake'), 500);
        }

        engine.nextTurn();
        setTimeout(initGame, 1500);
    }

    showPlayerSelection();
});
