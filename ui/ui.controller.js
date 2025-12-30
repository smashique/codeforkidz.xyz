import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let currentRemainingTime = 60; // Default Adrenaline Timer duration
let discoveryData = { age: '4-5', theme: 'space', players: 1 };

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const headerNav = document.querySelector('nav');
    
    // ১. DISCOVERY PHASE: Age, Operation & Theme Selection
    function showDiscoveryPhase() {
        gameContainer.innerHTML = `
            <div class="setup-box">
                <h2>PHASE 1: DISCOVERY</h2>
                <div class="discovery-grid">
                    <label>Target Age Group:</label>
                    <select id="age-group">
                        <option value="4-5">Age 4-5 (Early Math)</option>
                        <option value="6-7">Age 6-7 (Basic Ops)</option>
                        <option value="8-9">Age 8-9 (Logical Logic)</option>
                        <option value="10-11">Age 10-11 (Algorithm Mastery)</option>
                        <option value="12+">Age 12+ (Advanced Algebra)</option>
                    </select>

                    <label>Multiplayer Identity:</label>
                    <select id="player-count">
                        <option value="1">1 Player</option>
                        <option value="2">2 Players</option>
                        <option value="3">3 Players</option>
                        <option value="4">4 Players</option>
                    </select>

                    <label>Choose Game World:</label>
                    <div class="theme-selection">
                        <button class="theme-btn" data-theme="jungle">🌿 Jungle</button>
                        <button class="theme-btn active" data-theme="space">🚀 Space</button>
                        <button class="theme-btn" data-theme="underwater">🧜‍♂️ Water</button>
                        <button class="theme-btn" data-theme="candy">🍬 Candy</button>
                    </div>
                </div>
                <button id="launch-mission" class="select-btn">LAUNCH MISSION</button>
            </div>
        `;

        // Theme Button Selection Logic
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });

        document.getElementById('launch-mission').onclick = () => {
            discoveryData.age = document.getElementById('age-group').value;
            discoveryData.players = parseInt(document.getElementById('player-count').value);
            discoveryData.theme = document.querySelector('.theme-btn.active').dataset.theme;

            // Apply Thematic UI
            document.body.className = `theme-${discoveryData.theme}`;
            soundEngine.init();
            engine.initPlayers(discoveryData.players);
            initGame();
        };
    }

    // ২. ADRENALINE TIMER: Countdown with Progress Bar
    function startAdrenalineHUD() {
        if (gameTimer) clearInterval(gameTimer);
        let timeLeft = 30; // 30 second adrenaline rush
        
        // Timer UI creation
        headerNav.innerHTML = `
            <div id="player-score">P1: 0</div>
            <div id="timer-hud">
                <div id="progress-bar-container">
                    <div id="timer-fill"></div>
                </div>
                <span id="timer-text">30s</span>
            </div>
        `;

        gameTimer = setInterval(() => {
            timeLeft--;
            const fill = document.getElementById('timer-fill');
            const text = document.getElementById('timer-text');
            const card = document.querySelector('.algorithm-card');
            
            if (fill) fill.style.width = `${(timeLeft / 30) * 100}%`;
            if (text) text.innerText = `${timeLeft}s`;

            // Adrenaline Rush: 5-second pulse
            if (timeLeft <= 5) {
                if (card) card.classList.add('shake-urgent');
                if (text) text.style.color = 'red';
                // soundEngine.playTick(); 
            }

            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                handleFailure();
            }
        }, 1000);
    }

    function initGame() {
        if (!engine.isPaid && engine.getUsedTime() >= engine.FREE_TIME_LIMIT) {
            showPaywall();
            return;
        }
        startAdrenalineHUD();
        const data = engine.generatePattern(discoveryData.age);
        renderPattern(data);
    }

    function renderPattern(data) {
        const scoreDisplay = document.getElementById('player-score');
        scoreDisplay.innerHTML = engine.players.map(p => 
            `<span class="p-score ${p.id - 1 === engine.currentPlayerIndex ? 'active' : ''}" style="color:${p.color}">
                P${p.id}: ${p.score}
            </span>`
        ).join(' | ');

        gameContainer.innerHTML = `
            <div class="turn-indicator">PLAYER ${data.currentPlayer.id}'S TURN</div>
            <div class="algorithm-card">
                <div class="pattern-box">
                    ${data.sequence.map(n => `<span class="num">${n}</span>`).join(' → ')} → <span class="target">?</span>
                </div>
                <div class="options-grid">
                    ${data.options.map(opt => `<button class="option-btn" data-value="${opt}">${opt}</button>`).join('')}
                </div>
                <div class="social-actions">
                    <button onclick="window.printReportCard()" class="util-btn">📄 Report</button>
                    <button onclick="window.shareVictory()" class="util-btn">🔗 Share</button>
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
            soundEngine.playCorrect();
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 100 });
            gameContainer.innerHTML = `<div class="feedback correct">⚡ EXCELLENT LOGIC! LEVEL UP!</div>`;
        } else {
            soundEngine.playWrong();
            gameContainer.innerHTML = `<div class="feedback wrong">❌ CALIBRATING... TRY AGAIN!</div>`;
        }

        engine.nextTurn();
        setTimeout(initGame, 1500);
    }

    // UTILITY: Print & Share
    window.printReportCard = () => {
        const stats = engine.players.map(p => `Player ${p.id}: ${p.score}`).join('\n');
        const win = window.open('', 'PRINT', 'height=400,width=600');
        win.document.write(`<h1>MathGameAI Victory Report</h1><pre>${stats}</pre>`);
        win.print();
    };

    window.shareVictory = () => {
        const text = `I just mastered AI Algorithms on MathGameAI.xyz! Current Score: ${engine.players[0].score}`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
    };

    function showPaywall() {
        gameContainer.innerHTML = `
            <div class="paywall-box">
                <h2>TRIAL ENDED</h2>
                <button class="select-btn" onclick="window.open('https://mathgameai.gumroad.com/l/MathGameAIPro')">Get Unlimited Patterns ($2.99)</button>
            </div>
        `;
    }

    showDiscoveryPhase();
});
