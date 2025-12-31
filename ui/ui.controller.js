import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let canvas, ctx, currentMission;

document.addEventListener('DOMContentLoaded', () => {
    updateHUD();
    showDiscoveryMenu();
});

/**
 * ১. মিশন কন্ট্রোল মেনু (Discovery Phase)
 */
function showDiscoveryMenu() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="setup-box animate__animated animate__fadeIn">
            <h1 class="glitch" data-text="GEOMETRIC CONTROL">GEOMETRIC CONTROL</h1>
            <p style="color: #8b949e; margin-bottom: 25px;">Select your pilot experience level.</p>
            
            <div class="selection-card" style="margin-bottom:20px">
                <select id="age-group" class="modern-select">
                    <option value="4-5">Junior Pilot (Age 4-5)</option>
                    <option value="8-9">Commander (Age 8-9)</option>
                    <option value="12+">Quantum Expert (Age 12+)</option>
                </select>
            </div>
            
            <button id="launch-btn" class="launch-btn" style="width:100%">INITIATE LAUNCH</button>
        </div>
    `;

    document.getElementById('launch-btn').onclick = () => {
        soundEngine.init();
        soundEngine.playLaunch();
        startGeometricMission();
    };
}

/**
 * ২. জ্যামিতিক মিশন শুরু
 */
function startGeometricMission() {
    const container = document.getElementById('game-container');
    
    // লেভেল ১০ লক (সাবস্ক্রিপশন চেক)
    if (engine.level > 10 && !engine.isPaid) {
        showPaywall();
        return;
    }

    container.innerHTML = `
        <div class="algorithm-card">
            <div class="level-badge">MISSION LEVEL ${engine.level}</div>
            <canvas id="geometry-canvas" width="600" height="350"></canvas>
            <div class="options-grid"></div>
        </div>
    `;

    canvas = document.getElementById('geometry-canvas');
    if (canvas) ctx = canvas.getContext('2d');

    currentMission = engine.createGeometricMission();
    
    // মেইন ক্যানভাসে বড় আকৃতি আঁকা
    drawGeometry(ctx, currentMission.target, 80, currentMission.color, currentMission.rotation);
    renderOptions();
    updateHUD();
}

/**
 * ৩. জ্যামিতিক ড্রয়িং ইঞ্জিন (মাস্টার ফাংশন)
 */
function drawGeometry(context, shape, size, color, rotation = 0) {
    if (!context) return;
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    
    context.strokeStyle = color;
    context.lineWidth = 10;
    context.lineCap = "round";
    context.shadowBlur = 25;
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
    } else if (shape === 'pentagon' || shape === 'hexagon') {
        const sides = shape === 'pentagon' ? 5 : 6;
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
            context.lineTo(size * Math.cos(angle), size * Math.sin(angle));
        }
        context.closePath();
    }
    context.stroke();
    context.restore();
}

/**
 * ৪. গ্রাফিক্যাল অপশন রেন্ডারার (বাটন আইকন সহ)
 */
function renderOptions() {
    const grid = document.querySelector('.options-grid');
    grid.innerHTML = '';

    currentMission.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        // ছোট ক্যানভাস তৈরি আইকনের জন্য
        const iconCanvas = document.createElement('canvas');
        iconCanvas.width = 80;
        iconCanvas.height = 80;
        const iconCtx = iconCanvas.getContext('2d');
        
        btn.appendChild(iconCanvas);
        grid.appendChild(btn);
        
        // বাটনের ভেতরে ছোট সাদা আকৃতি আঁকা
        drawGeometry(iconCtx, opt, 25, '#ffffff', 0);

        btn.onclick = () => handleChoice(opt);
    });
}

/**
 * ৫. চয়েস হ্যান্ডলার
 */
window.handleChoice = (choice) => {
    if (choice === currentMission.target) {
        soundEngine.playCorrect();
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        engine.level++;
        setTimeout(startGeometricMission, 1000);
    } else {
        soundEngine.playWrong();
        if (canvas) {
            canvas.classList.add('fail-shake');
            setTimeout(() => canvas.classList.remove('fail-shake'), 500);
        }
    }
};

/**
 * ৬. HUD এবং পে-ওয়াল
 */
function updateHUD() {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.innerHTML = `
            <div class="score-hud">MISSION PROGRESS: ${engine.level}/10</div>
            <div id="timer-hud">
                <div id="progress-bar-container">
                    <div id="timer-fill" style="width:${Math.min((engine.level/10)*100, 100)}%"></div>
                </div>
            </div>
        `;
    }
}

function showPaywall() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <div class="setup-box animate__animated animate__fadeInUp">
            <h2 style="color:var(--primary-glow)">PRO ACCESS REQUIRED 🔒</h2>
            <p>You've mastered the basic shapes! Upgrade now to unlock 10,000+ unique fractal logic missions.</p>
            <a href="https://mathgameai.gumroad.com/l/MathGameAIPro" target="_blank" class="launch-btn" style="text-decoration:none; display:inline-block; margin-top:20px;">
                GET PRO ACCESS - $2.99
            </a>
        </div>
    `;
}
