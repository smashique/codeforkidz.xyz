import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let remainingTime = engine.isPaid ? 999999 : (engine.FREE_TIME_LIMIT - engine.getUsedTime());

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('player-score');
    const headerNav = document.querySelector('nav');

    // ১. টাইমার UI এলিমেন্ট সঠিকভাবে তৈরি করা
    const timerDisplay = document.createElement('span');
    timerDisplay.id = "timer-ui";
    headerNav.appendChild(timerDisplay);
    updateTimerUI(); // শুরুতে একবার টাইমার দেখানো

    function startTimer() {
        if (engine.isPaid || gameTimer) return;

        gameTimer = setInterval(() => {
            remainingTime--;
            updateTimerUI();
            
            // সময় শেষ হলে পেমেন্ট গেটওয়ে দেখানো
            if (remainingTime <= 0) {
                clearInterval(gameTimer);
                engine.saveTime(engine.FREE_TIME_LIMIT);
                showPaywall();
            } else {
                engine.saveTime(engine.FREE_TIME_LIMIT - remainingTime);
            }
        }, 1000);
    }

    function updateTimerUI() {
        const mins = Math.floor(remainingTime / 60);
        const secs = remainingTime % 60;
        timerDisplay.innerText = `Time Left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (remainingTime < 30) timerDisplay.classList.add('low-time');
    }

    // ২. গেম রেন্ডারিং লজিক (বাটন ফিক্স সহ)
    function showPlayerSelection() {
        gameContainer.innerHTML = `
            <div class="setup-box">
                <h2 style="margin-bottom: 30px;">SELECT PLAYERS</h2>
                <div class="selection-grid">
                    <button class="select-btn" data-players="1">1 Player</button>
                    <button class="select-btn" data-players="2">2 Players</button>
                    <button class="select-btn" data-players="3">3 Players</button>
                    <button class="select-btn" data-players="4">4 Players</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                soundEngine.init(); // সাউন্ড সক্রিয় করা
                const count = parseInt(btn.dataset.players);
                engine.initPlayers(count); 
                startTimer(); // প্রথম ক্লিকেই টাইমার চালু হবে
                initGame();
            });
        });
    }

    function initGame() {
        if (remainingTime > 0 || engine.isPaid) {
            const data = engine.generatePattern();
            renderPattern(data);
        } else {
            showPaywall();
        }
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
                    ${data.sequence.map(n => `<span class="num">${n}</span>`).join(' <span class="arrow">→</span> ')} <span class="arrow">→</span> <span class="target">?</span>
                </div>
                <div class="options-grid">
                    ${data.options.map(opt => `<button class="option-btn" data-value="${opt}">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        // বাটনগুলোতে ক্লিক লিসেনার যুক্ত করা
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => handleSubmission(btn.dataset.value, data.correctAnswer));
        });
    }

    function handleSubmission(userAnswer, correctAnswer) {
        const isCorrect = engine.validateAnswer(userAnswer, correctAnswer);
        
        if (isCorrect) {
            soundEngine.playCorrect();
            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
            gameContainer.innerHTML = `<div class="feedback correct">⚡ CORRECT! P${engine.currentPlayerIndex + 1} LOGIC VERIFIED!</div>`;
        } else {
            soundEngine.playWrong();
            gameContainer.innerHTML = `<div class="feedback wrong">❌ ERROR! WRONG PATTERN</div>`;
        }

        engine.nextTurn();
        setTimeout(initGame, 1500);
    }

    function showPaywall() {
        gameContainer.innerHTML = `
            <div class="paywall-box" style="text-align:center;">
                <h2 style="color:#ff4d4d;">LIMIT EXPIRED!</h2>
                <p>আপনার ৫ মিনিটের ফ্রি এক্সেস শেষ হয়েছে।</p>
                <button class="select-btn" onclick="window.open('https://wa.me/8801303680618')">অ্যাক্টিভেশন কি (Key) সংগ্রহ করুন</button>
            </div>
        `;
    }

    showPlayerSelection();
});
