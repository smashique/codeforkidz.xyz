import { engine } from '../engine/core.logic.js';
import { soundEngine } from '../engine/sound.logic.js';

let canvas, ctx;

document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('geometry-canvas');
    if (canvas) ctx = canvas.getContext('2d');
    
    // গেম শুরু করার আগে ডিসকভারি মেনু দেখানো
    showDiscoveryMenu();
});

/**
 * ১. জ্যামিতিক আকৃতি আঁকার মাস্টার ফাংশন
 * @param {CanvasRenderingContext2D} context - যে ক্যানভাসে আঁকা হবে
 * @param {string} shape - আকৃতির ধরণ (triangle, square, etc.)
 * @param {number} size - আকৃতির আকার
 * @param {string} color - নিওন রঙ
 * @param {number} rotation - ঘূর্ণন ডিগ্রী
 */
function drawGeometry(context, shape, size, color, rotation = 0) {
    const x = context.canvas.width / 2;
    const y = context.canvas.height / 2;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.save();
    context.translate(x, y);
    context.rotate((rotation * Math.PI) / 180);
    
    context.strokeStyle = color;
    context.lineWidth = 6;
    context.lineJoin = "round";
    context.shadowBlur = 20;
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
    } else if (shape === 'hexagon') {
        for (let i = 0; i < 6; i++) {
            const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
            context.lineTo(size * Math.cos(angle), size * Math.sin(angle));
        }
        context.closePath();
    }

    context.stroke();
    context.restore();
}

/**
 * ২. গ্রাফিক্যাল মিশন রেন্ডারার
 */
function initGeometricMission() {
    const mission = engine.createGeometricMission(); // লজিক ইঞ্জিন থেকে ডাটা নেয়া
    
    // মেইন ক্যানভাসে বড় আকৃতি আঁকা
    drawGeometry(ctx, mission.target, 80, mission.color, mission.rotation);

    const optionsContainer = document.querySelector('.options-grid');
    optionsContainer.innerHTML = '';

    // বাটন তৈরি এবং প্রতিটি বাটনে ছোট ক্যানভাস যোগ করা
    mission.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        
        // ছোট ক্যানভাস তৈরি (আইকনের জন্য)
        const btnCanvas = document.createElement('canvas');
        btnCanvas.width = 100;
        btnCanvas.height = 100;
        const btnCtx = btnCanvas.getContext('2d');
        
        btn.appendChild(btnCanvas);
        optionsContainer.appendChild(btn);
        
        // বাটনের ভেতরে ছোট আকৃতিটি আঁকা
        drawGeometry(btnCtx, opt, 30, '#ffffff', 0);

        btn.onclick = () => {
            if (opt === mission.target) {
                handleSuccess();
            } else {
                handleFailure();
            }
        };
    });
}

function handleSuccess() {
    soundEngine.playCorrect();
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    engine.level++;
    setTimeout(initGeometricMission, 1000);
}

function handleFailure() {
    soundEngine.playWrong();
    document.querySelector('.algorithm-card').classList.add('fail-shake');
    setTimeout(() => {
        document.querySelector('.algorithm-card').classList.remove('fail-shake');
    }, 500);
}

// এক্সপোর্ট বা গ্লোবাল এক্সেস (যদি প্রয়োজন হয়)
window.startGeometricGame = initGeometricMission;
