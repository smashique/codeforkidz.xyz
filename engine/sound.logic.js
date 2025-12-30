class SoundEngine {
    constructor() {
        this.ctx = null;
    }

    // সাউন্ড কন্টেক্সট ইনিশিয়ালাইজ করা (ইউজার ক্লিকের পর)
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    async playCorrect() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5 Note
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.3);
    }

    async playWrong() {
        this.init();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.2);
    }
}
export const soundEngine = new SoundEngine();
