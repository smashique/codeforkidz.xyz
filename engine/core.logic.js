/**
 * OMEGA AI - Infinite Multiverse Engine V20.5
 * Features: Age-specific Math Ops & Probabilistic UI Generator
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.isPaid = false;
        this.FREE_TIME_LIMIT = 300; 
        
        this.gameModules = {
            '4-5': ['Addition', 'Number Counting'],
            '6-7': ['Addition', 'Subtraction'],
            '8-9': ['Multiplication', 'Division'],
            '10-11': ['Algorithm', 'Fractions'],
            '12+': ['Algebra', 'Equations']
        };
        
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    // ১. ডাইনামিক ম্যাথ প্রবলেম জেনারেটর
    createMathProblem(type) {
        let a, b, correctAnswer, sequence, options;

        switch (type) {
            case 'Addition':
                a = Math.floor(Math.random() * (10 * this.level));
                b = Math.floor(Math.random() * (10 * this.level));
                correctAnswer = a + b;
                return { question: `${a} + ${b}`, answer: correctAnswer, options: this.generateOptions(correctAnswer) };

            case 'Subtraction':
                a = Math.floor(Math.random() * (20 * this.level));
                b = Math.floor(Math.random() * a); // রেজাল্ট যাতে নেগেটিভ না হয়
                correctAnswer = a - b;
                return { question: `${a} - ${b}`, answer: correctAnswer, options: this.generateOptions(correctAnswer) };

            case 'Algebra':
                // Linear Equation: ax + b = c
                let x = Math.floor(Math.random() * 10) + 1;
                let valA = Math.floor(Math.random() * 5) + 1;
                let valB = Math.floor(Math.random() * 10);
                let valC = (valA * x) + valB;
                // Question format using LaTeX: $ax + b = c$
                return { 
                    question: `$${valA}x + ${valB} = ${valC}$`, 
                    answer: x, 
                    options: this.generateOptions(x),
                    hint: "Find the value of x"
                };

            case 'Algorithm':
                const step = Math.floor(Math.random() * 5) + 1;
                let start = Math.floor(Math.random() * 10);
                sequence = [start, start + step, start + (step * 2), start + (step * 3)];
                correctAnswer = start + (step * 4);
                return { question: sequence.join(' → ') + ' → ?', answer: correctAnswer, options: this.generateOptions(correctAnswer) };

            default:
                return { question: "1 + 1", answer: 2, options: [1, 2, 3, 4] };
        }
    }

    // ২. অপশন জেনারেটর (সঠিক উত্তরের সাথে ৩টি ভুল উত্তর)
    generateOptions(correct) {
        let opts = new Set([correct]);
        while (opts.size < 4) {
            let offset = Math.floor(Math.random() * 10) - 5;
            let fake = correct + offset;
            if (fake >= 0) opts.add(fake);
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    }

    // ৩. আনলিমিটেড ইউআই থিম জেনারেটর
    generateInfiniteTheme(baseTheme) {
        const particles = ['Stars', 'Leaves', 'Bubbles', 'Candies', 'Pixels', 'Snow'];
        const seed = Math.random();
        return {
            base: baseTheme,
            hue: Math.floor(seed * 360),
            saturation: 60 + Math.floor(Math.random() * 30),
            particle: particles[Math.floor(Math.random() * particles.length)],
            id: `UID_${Date.now()}`
        };
    }

    // গেম মেকানিক্স
    initPlayers(count) {
        this.players = Array.from({ length: count }, (_, i) => ({ id: i + 1, score: 0, color: this.getPlayerColor(i) }));
        this.currentPlayerIndex = 0;
    }

    getPlayerColor(i) {
        return ['#00f2ff', '#ff00ff', '#39ff14', '#ffff00'][i % 4];
    }
}

export const engine = new GameEngine();
