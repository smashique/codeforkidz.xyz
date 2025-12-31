import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let canvas, ctx, currentMission;

document.addEventListener('DOMContentLoaded', () => {
    // ক্যানভাস ইনিশিয়ালাইজেশন
    canvas = document.getElementById('geometry-canvas');
    if (canvas) {
        ctx = canvas.getContext('2d');
        // ক্যানভাসের রেজোলিউশন ফিক্স করা
        canvas.width = 600;
        canvas.height = 400;
    }
    
    showDiscoveryMenu(); // প্রথমে মেনু দেখাবে
});

// মিশন শুরু করার ফাংশন
function startGeometricMission() {
    const overlay = document.getElementById('ui-overlay');
    if (overlay) overlay.style.display = 'none'; // লোডিং টেক্সট হাইড করা

    currentMission = engine.createGeometricMission();
    renderFrame();
}

function renderFrame() {
    if (!ctx) return;
    
    // মেইন ক্যানভাসে ড্র করা
    drawGeometry(ctx, currentMission.target, 80, currentMission.color, currentMission.rotation);
    
    renderOptions();
}

function drawGeometry(context, shape, size, color, rotation = 0) {
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    
    context.strokeStyle = color;
    context.lineWidth = 8;
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

function renderOptions() {
    const optionsGrid = document.querySelector('.options-grid') || document.getElementById('game-container');
    // যদি গ্রিড না থাকে তবে তৈরি করা
    let grid = document.querySelector('.options-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'options-grid';
        document.getElementById('game-container').appendChild(grid);
    }
    
    grid.innerHTML = currentMission.options.map(opt => `
        <button class="option-btn" onclick="processChoice('${opt}')">
            ${opt.toUpperCase()}
        </button>
    `).join('');
}

window.processChoice = (choice) => {
    if (choice === currentMission.target) {
        soundEngine.playCorrect();
        confetti();
        engine.level++;
        startGeometricMission();
    } else {
        soundEngine.playWrong();
        document.getElementById('geometry-canvas').classList.add('fail-shake');
        setTimeout(() => document.getElementById('geometry-canvas').classList.remove('fail-shake'), 500);
    }
};

// মেনু ফাংশন (আপনার আগের লজিক অনুযায়ী)
function showDiscoveryMenu() {
    const container = document.getElementById('game-container');
    container.innerHTML = `
        <canvas id="geometry-canvas" width="600" height="400"></canvas>
        <div class="setup-box">
            <h1 class="glitch">GEOMETRIC CONTROL</h1>
            <button class="launch-btn" onclick="startGeometricMission()">INITIATE MISSION</button>
        </div>
    `;
    // ক্যানভাস রেফারেন্স আবার সেট করা
    canvas = document.getElementById('geometry-canvas');
    ctx = canvas.getContext('2d');
}

window.startGeometricMission = startGeometricMission;
