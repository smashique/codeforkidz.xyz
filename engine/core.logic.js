/**
 * OMEGA AI - Codeforkidz Engine V21.5
 * Features: Age-specific Coding Ops, Infinite Leveling & Freemium Lock
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.isPaid = false;
        this.FREE_LEVEL_LIMIT = 10; // লেভেল ১০ পর্যন্ত ফ্রি
        
        // বয়স অনুযায়ী কোডিং ক্যাটাগরি ম্যাপিং
        this.gameModules = {
            '4-5': ['Sequencing', 'Logic Path'],
            '6-7': ['Sequencing', 'Directional Logic'],
            '8-9': ['Loop Mastery', 'Pattern Recognition'],
            '10-11': ['Algorithm Logic', 'Conditional If/Else'],
            '12+': ['Advanced Debugging', 'Syntax Logic', 'Algebraic Code']
        };
        
        this.players = [];
        this.currentPlayerIndex = 0;
        this.checkPremiumStatus();
    }

    // ১. প্রিমিয়াম স্ট্যাটাস চেক
    checkPremiumStatus() {
        this.isPaid = localStorage.getItem('codeforkidz_pro') === 'true';
    }

    // ২. ডাইনামিক কোডিং মিশন জেনারেটর
    createMathProblem(type) {
        let complexity = Math.floor(this.level / 5) + 2; 
        let question, answer, options, pattern;

        switch (type) {
            case 'Sequencing':
                // রোবটকে গন্তব্যে পৌঁছানোর সিকোয়েন্স
                let steps = ['Move', 'Turn Left', 'Turn Right', 'Jump'];
                let seq = Array.from({length: complexity}, () => steps[Math.floor(Math.random() * steps.length)]);
                answer = seq.pop();
                question = `Mission: Complete the sequence to reach the terminal. <br> <b>${seq.join(' → ')} → [?]</b>`;
                return { question, answer, options: this.generateOptions(answer, steps) };

            case 'Loop Mastery':
                // লুপের মাধ্যমে কোড অপ্টিমাইজেশন
                let count = Math.floor(Math.random() * 5) + 2;
                let action = ['Jump', 'Collect', 'Scan', 'Fly'][Math.floor(Math.random() * 4)];
                question = `Optimization: Repeat <b>[${action}]</b> ${count} times. Equivalent code?`;
                answer = `for(i=0; i<${count}; i++){ ${action} }`;
                options = [
                    answer,
                    `for(i=0; i<${count+1}; i++){ ${action} }`,
                    `repeat(${count-1}){ ${action} }`,
                    `while(i == ${count}){ ${action} }`
                ];
                return { question, answer: answer, options: options.sort(() => Math.random() - 0.5) };

            case 'Advanced Debugging':
                // কোডের ভুল খুঁজে বের করা
                let valX = Math.floor(Math.random() * 10);
                let valY = Math.floor(Math.random() * 10);
                answer = (valX + valY).toString();
                question = `Debug: let x = ${valX}; let y = ${valY}; print(x + y); <br> <b>What is the output?</b>`;
                return { question, answer: answer, options: this.generateOptions(answer) };

            case 'Algebraic Code':
                // কোডিং সিনট্যাক্সে বীজগণিত
                let x = Math.floor(Math.random() * 5) + 1;
                let a = Math.floor(Math.random() * 5) + 1;
                let c = a * x;
                question = `Logic: if (<b>${a} * x == ${c}</b>), what is <b>x</b>?`;
                return { question, answer: x.toString(), options: this.generateOptions(x.toString()) };

            default:
                return { question: "Init: [Move] → [?]", answer: "Move", options: ["Move", "Stop", "Turn", "Wait"] };
        }
    }

    // ৩. সাবস্ক্রিপশন ও লেভেল ভ্যালিডেশন
    validateAnswer(userAnswer, correctAnswer) {
        if (userAnswer == correctAnswer) {
            if (!this.isPaid && this.level >= this.FREE_LEVEL_LIMIT) {
                return "LIMIT_REACHED"; // লেভেল ১০-এ পে-ওয়াল লক
            }
            this.level++;
            return "CORRECT";
        }
        return "WRONG";
    }

    // ৪. গুমরোড লাইসেন্স কী ভ্যালিডেশন
    validateLicenseKey(key) {
        const secretKey = "CODE-PRO-2025"; // আপনার সিক্রেট কী
        if (key === secretKey) {
            this.isPaid = true;
            localStorage.setItem('codeforkidz_pro', 'true');
            return true;
        }
        return false;
    }

    // ৫. ডাইনামিক অপশন জেনারেটর
    generateOptions(correct, pool = null) {
        let opts = new Set([correct]);
        if (pool) {
            while (opts.size < 4) opts.add(pool[Math.floor(Math.random() * pool.length)]);
        } else {
            while (opts.size < 4) {
                let fake = (parseInt(correct) + (Math.floor(Math.random() * 10) - 5)).toString();
                if (parseInt(fake) >= 0) opts.add(fake);
            }
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    }

    // ৬. আনলিমিটেড ইউআই থিম জেনারেটর (পুনরাবৃত্তির সম্ভাবনা ০.০০...০১%)
    generateInfiniteTheme(baseTheme) {
        const particles = ['Stars', 'Leaves', 'Bubbles', 'Pixels', 'Snow'];
        return {
            base: baseTheme,
            hue: Math.floor(Math.random() * 360), // ৩৬০টি ইউনিক রঙ
            saturation: 60 + Math.floor(Math.random() * 30),
            particle: particles[Math.floor(Math.random() * particles.length)],
            id: `UID_${Date.now()}`
        };
    }

    initPlayers(count) {
        this.players = Array.from({ length: count }, (_, i) => ({ 
            id: i + 1, 
            score: 0, 
            color: ['#00f2ff', '#ff00ff', '#39ff14', '#ffff00'][i % 4] 
        }));
        this.currentPlayerIndex = 0;
    }
}

export const engine = new GameEngine();
