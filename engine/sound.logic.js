/**
 * OMEGA AI - Procedural Sound Engine V1.0
 * Generates unlimited algorithmic dopamine sounds
 */
class SoundEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // সঠিক উত্তরের জন্য Algorithm-based Arpeggio
    playCorrect() {
        const now = this.ctx.currentTime;
        const oscillator = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // লজিক: Major Scale Notes (C4, E4, G4, C5) থেকে র‍্যান্ডম কম্বিনেশন
        const scale = [261.63, 329.63, 392.00, 523.25];
        const randomNote = scale[Math.floor(Math.random() * scale.length)];

        oscillator.type = 'sine'; // পরিষ্কার সাউন্ডের জন্য
        oscillator.frequency.setValueAtTime(randomNote, now);
        // ফ্রিকোয়েন্সি স্লাইড (Dopamine boost effect)
        oscillator.frequency.exponentialRampToValueAtTime(randomNote * 2, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.connect(gain);
        gain.connect(this.ctx.destination);

        oscillator.start();
        oscillator.stop(now + 0.3);
    }

    // ভুল উত্তরের জন্য Low-Frequency Dissonance
    playWrong() {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        // র‍্যান্ডম নিচু ফ্রিকোয়েন্সি (Dissonant vibration)
        const freq = 100 + Math.random() * 50;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.linearRampToValueAtTime(freq - 20, now + 0.2);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(now + 0.2);
    }
}

export const soundEngine = new SoundEngine();
