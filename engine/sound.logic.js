/**
 * OMEGA AI - Codeforkidz Sound Engine V21.5
 * Features: Synthetic Cyber-Sounds, Adrenaline Ticks & Mission FX
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    // ১. সাউন্ড কন্টেক্সট ইনিশিয়ালাইজ করা (ইউজার ক্লিকের পর)
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // ২. মিশন লঞ্চ সাউন্ড (Power-up Riser)
    async playLaunch() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.8);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.8);
    }

    // ৩. সঠিক উত্তর (Cyber Arpeggio) - ডোপামিন বুস্ট
    async playCorrect() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const now = this.ctx.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (Major Chord)

        frequencies.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + (i * 0.05));
            gain.gain.setValueAtTime(0.05, now + (i * 0.05));
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3 + (i * 0.05));
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + (i * 0.05));
            osc.stop(now + 0.4 + (i * 0.05));
        });
    }

    // ৪. ভুল উত্তর (Gritty Error Sound)
    async playWrong() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(50, now + 0.3);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.3);
    }

    // ৫. এড্রেনালিন টিক (Timer Warning)
    async playTick() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.05);
    }
}
export const soundEngine = new SoundEngine();
