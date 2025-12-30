import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let currentDiscovery = { age: '4-5', mode: 'Addition', theme: 'Space' };

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const headerNav = document.querySelector('nav');

    // PHASE 1: Mission Briefing (Discovery Menu)
    function showDiscoveryMenu() {
        gameContainer.innerHTML = `
            <div class="setup-box animate__animated animate__fadeIn">
                <h1 class="glitch" data-text="MISSION CONTROL">MISSION CONTROL</h1>
                <p style="color: #8b949e; margin-bottom: 30px;">Select your parameters, Pilot.</p>
                
                <div class="discovery-grid">
                    <div class="selection-card">
                        <span>Target Age Group</span>
                        <select id="age-group" class="modern-select">
                            ${Object.keys(engine.gameModules).map(age => `<option value="${age}">Commander (Age ${age})</option>`).join('')}
                        </select>
                    </div>

                    <div class="selection-card">
                        <span>Mission Operation</span>
                        <select id="op-type" class="modern-select"></select>
                    </div>

                    <div class="selection-card">
                        <span>Environment Theme</span>
                        <div class="theme-selection">
                            <button class="theme-btn" data-theme="Jungle">Jungle 🌿</button>
                            <button class="theme-btn active" data-theme="Space">Space 🚀</button>
                            <button class="theme-btn" data-theme="Underwater">Water 🧜‍♂️</button>
                            <button class="theme-btn" data-theme="Candy">Candy 🍬</button>
                        </div>
                    </div>
                </div>
                
                <button id="launch-mission" class="launch-btn">INITIATE MISSION</button>
            </div>
        `;

        const ageSelect = document.getElementById('age-group');
        const opSelect = document.getElementById('op-type');

        const updateOps = () => {
            const ops = engine.gameModules[ageSelect.value];
            opSelect.innerHTML = ops.map(o => `<option value="${o}">${o}</option>`).join('');
        };

        ageSelect.onchange = updateOps;
        updateOps();

        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            };
        });

        document.getElementById('launch-mission').onclick = () => {
            currentDiscovery.age = ageSelect.value;
            currentDiscovery.mode = opSelect.value;
            currentDiscovery.theme = document.querySelector('.theme-btn.active').dataset.theme;
            
            soundEngine.init();
            engine.initPlayers(1);
            applyInfiniteTheme();
            initGame();
        };
    }

    // PHASE 2: Infinite Multiverse UI Logic
    function applyInfiniteTheme() {
        const config = engine.generateInfiniteTheme(currentDiscovery.theme);
        document.body.className = `theme-${config.base.toLowerCase()}`;
        // মাউস মুভমেন্টের সাথে ফিল্টার পরিবর্তনের জন্য এটি ব্যবহার করা যায়
        document.body.style.filter = `hue-rotate(${config.hue}deg) saturate(${config.saturation}%)`;
        console.log(`OMEGA AI: Unique Mission Environment Loaded [ID: ${config.id}]`);
    }

    function startAdrenalineTimer() {
        if (gameTimer) clearInterval(gameTimer);
        let timeLeft = 30;
        
        headerNav.innerHTML = `
            <div id="player-score" class="score-hud">Score: ${engine.players[0].score}</div>
            <div id="timer-hud">
                <div id="progress-bar-container"><div id="timer-fill"></div></div>
                <span id="timer-text">30s</span>
            </div>
        `;

        gameTimer = setInterval(() => {
            timeLeft--;
            const fill = document.getElementById('timer-fill');
            const card = document.querySelector('.algorithm-card');
            
            if (fill) fill.style.width = `${(timeLeft / 30) * 100}%`;
            if (document.getElementById('timer-text')) document.getElementById('timer-text').innerText = timeLeft + 's';

            if (timeLeft <= 5 && card) {
                card.classList.add('shake-urgent');
                soundEngine.playTick?.(); // Optional tick sound
            }
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                initGame();
            }
        }, 1000);
    }

    function initGame() {
        if (!engine.isPaid && engine.getUsedTime() >= engine.FREE_TIME_LIMIT) {
            showPaywall();
            return;
        }
        startAdrenalineTimer();
        const problem = engine.createMathProblem(currentDiscovery.mode);
        renderGame(problem);
    }

    function renderGame(data) {
        gameContainer.innerHTML = `
            <div class="algorithm-card glass-card">
                <div id="math-display" class="pattern-box"></div>
                <div class="options-grid">
                    ${data.options.map(opt => `<button class="option-btn glass-btn" data-val="${opt}">${opt}</button>`).join('')}
                </div>
                <div class="social-actions">
                    <button class="util-btn" onclick="window.printReport()">📄 MISSION REPORT</button>
                    <button class="util-btn" onclick="window.shareWin()">🔗 LOG VICTORY</button>
                </div>
            </div>
        `;

        const display = document.getElementById('math-display');
        if (data.question.includes('$')) {
            const formula = data.question.replace(/\$/g, '');
            katex.render(formula, display, { throwOnError: false });
        } else {
            display.innerText = data.question;
        }

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => handleSubmission(btn, data);
        });
    }

    function handleSubmission(btn, data) {
        const card = document.querySelector('.algorithm-card');
        if (btn.dataset.val == data.answer) {
            soundEngine.playCorrect();
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            engine.players[0].score += 10;
            btn.classList.add('correct-flash');
        } else {
            soundEngine.playWrong();
            card.classList.add('fail-shake');
            setTimeout(() => card.classList.remove('fail-shake'), 500);
        }
        setTimeout(initGame, 1000);
    }

    // Utility Functions
    window.printReport = () => {
        const score = engine.players[0].score;
        const win = window.open('', 'PRINT', 'height=400,width=600');
        win.document.write(`<h1>MathGameAI Victory Report</h1><p>Mission: ${currentDiscovery.mode}</p><p>Score: ${score}</p>`);
        win.print();
    };

    showDiscoveryMenu();
});
