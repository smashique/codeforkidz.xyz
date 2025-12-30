import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let remainingTime = engine.isPaid ? 999999 : (engine.FREE_TIME_LIMIT - engine.getUsedTime());

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('player-score');
    const headerNav = document.querySelector('nav');

    // ১. টাইমার UI তৈরি
    const timerDisplay = document.createElement('span');
    timerDisplay.id = "timer-ui";
    headerNav.appendChild(timerDisplay);
    updateTimerUI();

    function startTimer() {
        if (engine.isPaid || gameTimer) return;
        gameTimer = setInterval(() => {
            remainingTime--;
            updateTimerUI();
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
        if (engine.isPaid) {
            timerDisplay.innerText = "Access: UNLIMITED";
            timerDisplay.classList.remove('low-time');
            return;
        }
        const mins = Math.floor(remainingTime / 60);
        const secs = remainingTime % 60;
        timerDisplay.innerText = `Time Left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (remainingTime < 30) timerDisplay.classList.add('low-time');
    }

    // ২. গেম ফ্লো লজিক
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
                soundEngine.init();
                engine.initPlayers(parseInt(btn.dataset.players)); 
                startTimer();
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

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => handleSubmission(btn.dataset.value, data.correctAnswer));
        });
    }

    function handleSubmission(userAnswer, correctAnswer) {
        const isCorrect = engine.validateAnswer(userAnswer, correctAnswer);
        if (isCorrect) {
            soundEngine.playCorrect();
            if (typeof confetti === 'function') confetti({ particleCount: 100, spread: 70 });
            gameContainer.innerHTML = `<div class="feedback correct">⚡ CORRECT! P${engine.currentPlayerIndex + 1} SCORED!</div>`;
        } else {
            soundEngine.playWrong();
            gameContainer.innerHTML = `<div class="feedback wrong">❌ ERROR! WRONG PATTERN</div>`;
        }
        engine.nextTurn();
        setTimeout(initGame, 1500);
    }

    // ৩. ফাইনাল পে-ওয়াল (গুমরোড + অ্যাক্টিভেশন)
    function showPaywall() {
        // ওমেগা ইন্টিগ্রেশন: আপনার আসল গুমরোড লিঙ্ক এখানে যুক্ত করা হয়েছে
        const gumroadProductLink = "https://mathgameai.gumroad.com/l/MathGameAIPro"; 

        gameContainer.innerHTML = `
            <div class="paywall-box" style="text-align:center;">
                <h2 style="color:#ff4d4d; font-size: 2rem; margin-bottom: 15px;">PRO ACCESS REQUIRED</h2>
                <p style="margin-bottom: 25px;">মাত্র $2.99/মাসে আনলক করুন আনলিমিটেড AI লজিক এবং মাল্টিপ্লেয়ার চ্যালেঞ্জ।</p>
                
                <a href="${gumroadProductLink}" target="_blank" class="select-btn" style="text-decoration:none; display:inline-block; margin-bottom:30px; background:var(--neon-blue); color:black; font-weight:bold;">
                    Get Pro Access - $2.99/Month
                </a>
                
                <div class="activation-zone" style="border-top: 1px solid #333; padding-top: 25px;">
                    <p style="font-size: 0.9rem; color: #8b949e;">লাইসেন্স কী (License Key) আছে? এখানে দিন:</p>
                    <input type="text" id="license-key-input" placeholder="Enter Key Here" style="padding:12px; border-radius:8px; border:1px solid var(--neon-blue); background:transparent; color:white; margin-top:10px; width: 100%; max-width: 300px; text-align:center;">
                    <br>
                    <button id="activate-btn" class="option-btn" style="margin-top: 15px; width: 100%; max-width: 300px;">Activate Now</button>
                    <p id="key-error" style="color:#ff4d4d; display:none; margin-top:10px;">লাইসেন্স কী সঠিক নয়!</p>
                </div>
            </div>
        `;

        document.getElementById('activate-btn').onclick = () => {
            const inputKey = document.getElementById('license-key-input').value.trim();
            if (engine.validateLicenseKey(inputKey)) {
                soundEngine.playCorrect();
                alert("Unlimited Access Unlocked Successfully!");
                location.reload(); 
            } else {
                soundEngine.playWrong();
                document.getElementById('key-error').style.display = 'block';
            }
        };
    }

    showPlayerSelection();
});
