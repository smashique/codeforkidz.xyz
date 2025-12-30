import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let currentDiscovery = { age: '4-5', mode: 'Addition', theme: 'Space' };

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const headerNav = document.querySelector('nav');

    // PHASE 1: Discovery Menu (Age, Operation & Theme Selection)
    function showDiscoveryMenu() {
        gameContainer.innerHTML = `
            <div class="setup-box">
                <h2 style="color:var(--neon-blue)">MISSION DISCOVERY</h2>
                <div class="discovery-grid">
                    <label>Pilot Age:</label>
                    <select id="age-group">
                        ${Object.keys(engine.gameModules).map(age => `<option value="${age}">Age ${age}</option>`).join('')}
                    </select>

                    <label>Mission Type:</label>
                    <select id="op-type">
                        </select>

                    <label>Environment Theme:</label>
                    <div class="theme-selection">
                        <button class="theme-btn" data-theme="Jungle">Jungle 🌿</button>
                        <button class="theme-btn active" data-theme="Space">Space 🚀</button>
                        <button class="theme-btn" data-theme="Underwater">Water 🧜‍♂️</button>
                        <button class="theme-btn" data-theme="Candy">Candy 🍬</button>
                    </div>
                </div>
                <button id="launch-mission" class="select-btn">LAUNCH MISSION</button>
            </div>
        `;

        const ageSelect = document.getElementById('age-group');
        const opSelect = document.getElementById('op-type');

        const updateOps = () => {
            const ops = engine.gameModules[ageSelect.value];
            opSelect.innerHTML = ops.map(o => `<option value="${o}">${o}</option>`).join('');
        };

        ageSelect.onchange = updateOps;
        updateOps(); // Initial load

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
            engine.initPlayers(1); // Default 1 player, can be dynamic
            applyInfiniteTheme();
            initGame();
        };
    }

    // PHASE 2: Infinite UI & Adrenaline Logic
    function applyInfiniteTheme() {
        const config = engine.generateInfiniteTheme(currentDiscovery.theme);
        document.body.className = `theme-${config.base.toLowerCase()}`;
        document.body.style.filter = `hue-rotate(${config.hue}deg) saturate(${config.saturation}%)`;
        console.log(`OMEGA AI: Unique UI Generated [ID: ${config.id}]`);
    }

    function startAdrenalineTimer() {
        if (gameTimer) clearInterval(gameTimer);
        let timeLeft = 30;
        
        headerNav.innerHTML = `
            <div id="player-score" style="color:var(--neon-blue)">Score: 0</div>
            <div id="timer-hud" style="width:200px">
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

            if (timeLeft <= 5 && card) card.classList.add('shake-urgent');
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                initGame(); // Time out moves to next
            }
        }, 1000);
    }

    function initGame() {
        startAdrenalineTimer();
        const problem = engine.createMathProblem(currentDiscovery.mode);
        renderGame(problem);
    }

    function renderGame(data) {
        gameContainer.innerHTML = `
            <div class="algorithm-card">
                <div id="math-display" class="pattern-box"></div>
                <div class="options-grid">
                    ${data.options.map(opt => `<button class="option-btn" data-val="${opt}">${opt}</button>`).join('')}
                </div>
                <div class="social-actions">
                    <button class="util-btn" onclick="window.printReport()">📄 Report</button>
                    <button class="util-btn" onclick="window.shareWin()">🔗 Share</button>
                </div>
            </div>
        `;

        // LaTeX Rendering for Algebra
        const display = document.getElementById('math-display');
        if (data.question.includes('$')) {
            const formula = data.question.replace(/\$/g, '');
            katex.render(formula, display, { throwOnError: false });
        } else {
            display.innerText = data.question;
        }

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => {
                if (btn.dataset.val == data.answer) {
                    soundEngine.playCorrect();
                    if (typeof confetti === 'function') confetti();
                    engine.players[0].score += 10;
                } else {
                    soundEngine.playWrong();
                }
                setTimeout(initGame, 1000);
            };
        });
    }

    // Utility Functions
    window.printReport = () => {
        const score = engine.players[0].score;
        const win = window.open('', 'PRINT', 'height=400,width=600');
        win.document.write(`<h1>MathGameAI Report</h1><p>Age Group: ${currentDiscovery.age}</p><p>Final Score: ${score}</p>`);
        win.print();
    };

    showDiscoveryMenu();
});
