/**
 * OMEGA AI - Core Logic Engine V15.0
 * Architect: S M Ashique
 */

class GameEngine {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.operators = ['+']; // শুরুতে শুধু যোগ
        this.history = [];
    }

    // লেভেল অনুযায়ী ডিফিকাল্টি আপডেট
    updateDifficulty() {
        if (this.level > 5 && !this.operators.includes('-')) this.operators.push('-');
        if (this.level > 15 && !this.operators.includes('*')) this.operators.push('*');
        if (this.level > 25 && !this.operators.includes('/')) this.operators.push('/');
    }

    // আনলিমিটেড প্যাটার্ন জেনারেটর
    generatePattern() {
        this.updateDifficulty();
        
        const patternLength = 3 + Math.floor(this.level / 10);
        const step = Math.floor(Math.random() * (5 + this.level)) + 1;
        const operator = this.operators[Math.floor(Math.random() * this.operators.length)];
        
        let startValue = Math.floor(Math.random() * 50);
        let sequence = [startValue];

        for (let i = 1; i < patternLength; i++) {
            let nextValue = this.calculateNext(sequence[i - 1], step, operator);
            sequence.push(nextValue);
        }

        const correctAnswer = this.calculateNext(sequence[sequence.length - 1], step, operator);
        const options = this.generateOptions(correctAnswer);

        return {
            sequence,
            options,
            correctAnswer,
            level: this.level
        };
    }

    calculateNext(current, step, op) {
        switch (op) {
            case '+': return current + step;
            case '-': return current - step;
            case '*': return current * step;
            case '/': return parseFloat((current / step).toFixed(1));
            default: return current + step;
        }
    }

    // ভুল অপশন তৈরি করা (Distractors)
    generateOptions(correct) {
        let options = new Set([correct]);
        while (options.size < 4) {
            let fake = correct + (Math.floor(Math.random() * 20) - 10);
            if (fake !== correct) options.add(fake);
        }
        // Shuffle options
        return Array.from(options).sort(() => Math.random() - 0.5);
    }

    validateAnswer(userAnswer, correctAnswer) {
        if (userAnswer == correctAnswer) {
            this.level++;
            this.score += 10 * (this.level - 1);
            return true;
        }
        return false;
    }
}

export const engine = new GameEngine();
