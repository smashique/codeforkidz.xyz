import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let canvas, ctx, currentMission;
let gameTimer = null;

document.addEventListener('DOMContentLoaded', () => {
    // প্রাথমিক হেড সেটআপ
    updateHUD();
    showDiscoveryMenu();
});

/**
 * ১. মিশন কন্ট্রোল মেনু (Discovery Phase)
 */
function showDiscoveryMenu() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="setup-box animate__animated animate__zoomIn">
            <h1 class="glitch" data-text="GEOMETRIC CONTROL">GEOMETRIC CONTROL</h1>
            <p style="color: #8b949e; margin-bottom: 30px;">Master logic through visual patterns.</p>
            
            <div class="selection-card">
                <span>Select Pilot Experience</span>
                <select id="age-group" class="modern-select">
                    <option value="4-5">Junior (Age 4-5)</option>
                    <option value="8-9">Commander (Age 8-9)</option>
                    <option value="12+">Expert (Age 12+)</option>
                </select>
            </div>
            
            <button id="launch-btn" class="launch-btn" style="width:100%; margin-top:20px;">INITIATE MISSION</button>
        </div>
    `;

    document.getElementById('launch-btn').onclick = () => {
        soundEngine.init();
        soundEngine.playLaunch();
        startGeometricMission();
    };
}

/**
 * ২. মিশন শুরু করার লজিক
 */
function startGeometricMission() {
    const container = document.getElementById('game-container');
    
    // লেভেল ১০ লক চেক (সাবস্ক্রিপশন লজিক)
    if (engine.level > 10 && !engine.isPaid) {
        showPaywall();
        return;
    }

    // গেম স্ক্রিন লেআউট তৈরি
    container.innerHTML = `
        <div class="algorithm-card">
            <div class="level-badge">MISSION LEVEL ${engine.level}</div>
            <canvas id="geometry-canvas" width="600" height="350"></canvas>
            <div class="options-grid"></div>
        </div>
    `;

    // ক্যানভাস রেফারেন্স আপডেট
    canvas = document.getElementById('geometry-canvas');
    if (canvas) ctx = canvas.getContext('2d');

    // নতুন জ্যামিতিক মিশন তৈরি
    currentMission = engine.createGeometricMission();
    
    // গ্রাফিক্স রেন্ডার করা
    drawGeometry(ctx, currentMission.target, 80, currentMission.color, currentMission.rotation);
    renderOptions();
    updateHUD();
}

/**
 * ৩. জ্যামিতিক আকৃতি ড্রয়িং ইঞ্জিন
 */
function drawGeometry(context, shape, size, color, rotation = 0) {
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    
    context.strokeStyle = color;
    context.lineWidth = 10;
    context.lineJoin = "round";
    context.shadowBlur = 30;
    context.shadowColor = color;
    
    context.beginPath();
    if (shape === 'triangle') {
        context.moveTo(0, -size);
        context.lineTo(size, size);
        context.lineTo(-size, size);
        context.closePath();
    } else if (shape === 'square') {
        context.rect(-size, -size, size * 2, size * 2);
    } else if (shape === 'circle') {
        context.arc(0, 0, size, 0, Math.PI * 2);
    } else if (shape === 'pentagon') {
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            context.lineTo(size * Math.cos(angle), size * Math.sin(angle));
        }
        context.closePath();
    }
    context.stroke();
    context.restore();
}

/**
 * ৪. অপশন বাটন রেন্ডারার
 */
function renderOptions() {
    const grid = document.querySelector('.options-grid');
    grid.innerHTML = currentMission.options.map(opt => `
        <button class="option-btn" onclick="handleChoice('${opt}')">
            ${opt.toUpperCase()}
        </button>
    `).join('');
}

/**
 * ৫. ইউজার চয়েস হ্যান্ডলার
 */
window.handleChoice = (choice) => {
    if (choice === currentMission.target) {
        soundEngine.playCorrect();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        engine.level++;
        setTimeout(startGeometricMission, 1000);
    } else {
        soundEngine.playWrong();
        canvas.classList.add('fail-shake');
        setTimeout(() => canvas.classList.remove('fail-shake'), 500);
    }
};

/**
 * ৬. HUD (Heads-Up Display) আপডেট
 */
function updateHUD() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.innerHTML = `
            <div id="player-score" class="score-hud">LEVEL PROGRESS: ${engine.level}/10</div>
            <div id="timer-hud">
                <div id="progress-bar-container"><div id="timer-fill" style="width:${(engine.level/10)*100}%"></div></div>
            </div>
        `;
    }
}

/**
 * ৭. পে-ওয়াল (Level 10 Lock)
 */
function showPaywall() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="setup-box animate__animated animate__fadeInUp">
            <h2 style="color:var(--primary-glow)">MISSION LOCKED! 🔒</h2>
            <p>You've completed the free training. Upgrade to unlock 10,000+ unique geometric challenges.</p>
            <a href="https://mathgameai.gumroad.com/l/MathGameAIPro" target="_blank" class="launch-btn" style="text-decoration:none; display:inline-block;">GET EXPLORER PASS - $2.99</a>
        </div>
    `;
}
