import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let gameTimer = null;
let currentDiscovery = { age: '4-5', mode: 'Sequencing', theme: 'Space' };

document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const headerNav = document.querySelector('nav');

    // PHASE 1: Mission Briefing (Discovery Menu)
    function showDiscoveryMenu() {
        gameContainer.innerHTML = `
            <div class="setup-box animate__animated animate__fadeIn">
                <h1 class="glitch" data-text="MISSION CONTROL">MISSION CONTROL</h1>
                <p style="color: #8b949e; margin-bottom: 30px;">Set your parameters, Junior Coder.</p>
                
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
            soundEngine.playLaunch(); // Play mission riser sound
            engine.initPlayers(1);
            applyInfiniteTheme();
            initGame();
        };
    }

    // PHASE 2: Infinite Multiverse UI Logic
    function applyInfiniteTheme() {
        const config = engine.generateInfiniteTheme(currentDiscovery.theme);
        document.body.className = `theme-${config.base.toLowerCase()}`;
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
                soundEngine.playTick(); // Play Adrenaline Tick
            }
            
            if (timeLeft <= 0) {
                clearInterval(gameTimer);
                initGame(); // Time out moves to next mission
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
            <div class="algorithm-card glass-card">
                <div class="level-badge">LEVEL ${engine.level}</div>
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
        // KaTeX Rendering for Logic/Algebra
        if (data.question.includes('$')) {
            const formula = data.question.replace(/\$/g, '');
            katex.render(formula, display, { throwOnError: false });
        } else {
            display.innerHTML = data.question;
        }

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.onclick = () => handleSubmission(btn, data);
        });
    }

    function handleSubmission(btn, data) {
        const status = engine.validateAnswer(btn.dataset.val, data.answer);

        if (status === "CORRECT") {
            soundEngine.playCorrect(); // Cyber Arpeggio sound
            if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
            engine.players[0].score += 10;
            btn.classList.add('correct-flash');
            setTimeout(initGame, 1000);
        } 
        else if (status === "LIMIT_REACHED") {
            soundEngine.playWrong();
            showPaywall(); // Level 10 Lock
        }
        else {
            soundEngine.playWrong();
            const card = document.querySelector('.algorithm-card');
            card.classList.add('fail-shake');
            setTimeout(() => {
                card.classList.remove('fail-shake');
                initGame();
            }, 1000);
        }
    }

    function showPaywall() {
        if (gameTimer) clearInterval(gameTimer);
        gameContainer.innerHTML = `
            <div class="setup-box glass-card animate__animated animate__zoomIn">
                <h2 style="color:var(--primary-glow)">MISSION LOCKED! 🔒</h2>
                <p>Congratulations! You've mastered the first 10 Coding Levels.</p>
                <p style="margin-bottom:20px">Upgrade to the Explorer Pass to unlock Infinite Missions and Advanced Logic.</p>
                
                <a href="https://mathgameai.gumroad.com/l/MathGameAIPro" target="_blank" class="launch-btn" style="text-decoration:none; display:inline-block; margin-bottom:20px;">
                    Unlock Infinite Missions ($2.99)
                </a>
                
                <div class="activation-zone" style="margin-top:20px; border-top: 1px solid var(--glass-border); padding-top:20px;">
                    <p style="font-size:0.8rem; color:#8b949e; margin-bottom:10px;">Already have a key?</p>
                    <input type="text" id="license-key" class="modern-select" style="width:200px; display:inline-block;" placeholder="XXXX-XXXX-XXXX">
                    <button id="activate-pro" class="util-btn">Activate</button>
                </div>
            </div>
        `;

        document.getElementById('activate-pro').onclick = () => {
            const key = document.getElementById('license-key').value;
            if (engine.validateLicenseKey(key)) {
                alert("Access Granted! Infinite Multiverse Unlocked.");
                location.reload();
            } else {
                alert("Invalid Access Key.");
            }
        };
    }

    // Utility Functions
    window.printReport = () => {
        const score = engine.players[0].score;
        const win = window.open('', 'PRINT', 'height=400,width=600');
        win.document.write(`<h1>Codeforkidz.xyz Mission Report</h1><p>Commander: Player 1</p><p>Final Score: ${score}</p><p>Level Reached: ${engine.level}</p>`);
        win.print();
    };

    showDiscoveryMenu();
});
