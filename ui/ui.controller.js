import { engine } from '../engine/core.logic.js';

const canvas = document.getElementById('geometry-canvas');
const ctx = canvas?.getContext('2d');

/**
 * জ্যামিতিক আকৃতি ড্রয়িং ফাংশন
 */
function drawShape(shape, color, rotation = 0) {
    if (!ctx) return;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const size = 80;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.beginPath();

    if (shape === 'triangle') {
        ctx.moveTo(0, -size);
        ctx.lineTo(size, size);
        ctx.lineTo(-size, size);
        ctx.closePath();
    } else if (shape === 'square') {
        ctx.rect(-size, -size, size * 2, size * 2);
    } else if (shape === 'circle') {
        ctx.arc(0, 0, size, 0, Math.PI * 2);
    } else if (shape === 'pentagon') {
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(size * Math.cos(i * 2 * Math.PI / 5), size * Math.sin(i * 2 * Math.PI / 5));
        }
        ctx.closePath();
    }

    ctx.stroke();
    ctx.restore();
}

/**
 * গেম মিশন রেন্ডার করা (টেক্সট ছাড়া)
 */
export function initGeometricGame() {
    const mission = engine.createGeometricMission();
    drawShape(mission.target, mission.color, mission.rotation);

    const optionsContainer = document.querySelector('.options-grid');
    optionsContainer.innerHTML = mission.options.map(opt => `
        <button class="option-btn" onclick="checkChoice('${opt}', '${mission.target}')">
            <span class="shape-icon">${opt.toUpperCase()}</span>
        </button>
    `).join('');
}

window.checkChoice = (choice, correct) => {
    if (choice === correct) {
        engine.level++;
        // Success Sound & Confetti
        initGeometricGame();
    } else {
        // Error Shake
    }
};
