import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer;
let remainingTime = engine.isPaid ? 999999 : (engine.FREE_TIME_LIMIT - engine.getUsedTime());

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('player-score');
    const headerNav = document.querySelector('nav');

    // টাইমার UI এলিমেন্ট তৈরি এবং যুক্ত করা
    const timerDisplay = document.createElement('span');
    timerDisplay.id = "timer-ui";
    headerNav.appendChild(timerDisplay);

    // --- টাইমার লজিক ---

    function startTimer() {
        if (engine.isPaid) {
            timerDisplay.innerText = "Access: UNLIMITED";
            return;
        }

        if (gameTimer) return; // টাইমার একবারই শুরু হবে

        gameTimer = setInterval(() => {
            remainingTime--;
            updateTimerUI();
            
            // ইঞ্জিনে ব্যবহৃত সময় সেভ করা
            engine.saveTime(engine.FREE_TIME_LIMIT - remainingTime);

            if (remainingTime <= 0) {
                clearInterval(gameTimer);
                showPaywall();
            }
        }, 1000);
    }

    function updateTimerUI() {
        const mins = Math.floor(remainingTime / 60);
        const secs = remainingTime % 60;
        timerDisplay.innerText = `Time Left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        
        // ৩০ সেকেন্ডের নিচে আসলে এলার্ট স্টাইল (CSS .low-time ক্লাস ব্যবহার করবে)
        if (remainingTime < 30) {
            timerDisplay.classList.add('low-time');
        }
    }

    function showPaywall() {
        gameContainer.innerHTML = `
            <div class="paywall-box">
                <h2 style="color:#ff4d4d; font-size: 2.5rem; margin-bottom: 20px;">TIME EXPIRED!</h2>
                <p style="margin-bottom: 30px; font-size: 1.2rem;">আপনার আজকের ৫ মিনিটের ফ্রি ট্রায়াল শেষ।</p>
                <div class="upgrade-options">
                    <button class="select-btn" onclick="window.open('https://wa.me/8801303680618')">Unlock Unlimited Access</button>
                    <button class="option-btn" style="margin-top: 20px;" onclick="location.reload()">Try Again Later</button>
                </div>
            </div>
        `;
    }

    // --- গেম ফ্লো লজিক ---

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
            btn.onclick = () => {
                // ব্রাউজার অডিও পলিসি মেনে সাউন্ড ইঞ্জিন ইনিশিয়েট করা
                soundEngine.init(); 
                const count = parseInt(btn.dataset.players);
                engine.initPlayers(count); 
                initGame();
            };
        });
    }

    function initGame() {
        // গেম শুরু হওয়ার সাথে সাথে টাইমার চালু করা
        if (remainingTime > 0 || engine.isPaid) {
            startTimer();
            const data = engine.generatePattern();
            renderPattern(data);
        } else {
            showPaywall();
        }
    }

    function renderPattern(data) {
        // স্কোরবোর্ড রেন্ডার
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
        // সময় শেষ হয়ে গেলে আর সাবমিশন নেবে না
        if (remainingTime <= 0 && !engine.isPaid) return;

        const isCorrect = engine.validateAnswer(userAnswer, correctAnswer);
        
        if (isCorrect) {
            soundEngine.playCorrect();
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70 });
            gameContainer.innerHTML = `<div class="feedback correct">⚡ CORRECT! PLAYER ${engine.currentPlayerIndex + 1} SCORED!</div>`;
        } else {
            soundEngine.playWrong();
            gameContainer.innerHTML = `<div class="feedback wrong">❌ LOGIC ERROR! NEXT PLAYER...</div>`;
            gameContainer.classList.add('shake');
            setTimeout(() => gameContainer.classList.remove('shake'), 500);
        }

        engine.nextTurn();

        // ১.৫ সেকেন্ড পর নতুন প্যাটার্ন (যদি সময় থাকে)
        setTimeout(() => {
            if (remainingTime > 0 || engine.isPaid) {
                initGame();
            } else {
                showPaywall();
            }
        }, 1500);
    }

    // শুরুতে প্লেয়ার সিলেকশন মেনু দেখানো
    showPlayerSelection();
});
