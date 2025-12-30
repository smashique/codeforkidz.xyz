/**
 * OMEGA AI - Verified Multi-Player Engine V15.2
 * Logic: Procedural Pattern Generation + Float Safety
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.operators = ['+'];
        this.players = [];
        this.currentPlayerIndex = 0;
    }

    // প্লেয়ার সংখ্যা অনুযায়ী ইঞ্জিন রিসেট করা
    initPlayers(count) {
        this.players = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            score: 0
        }));
        this.currentPlayerIndex = 0;
        this.level = 1;
        this.operators = ['+'];
    }

    updateDifficulty() {
        if (this.level > 5 && !this.operators.includes('-')) this.operators.push('-');
        if (this.level > 15 && !this.operators.includes('*')) this.operators.push('*');
        if (this.level > 25 && !this.operators.includes('/')) this.operators.push('/');
    }

    generatePattern() {
        this.updateDifficulty();
        const patternLength = 3 + Math.floor(this.level / 10);
        const step = Math.floor(Math.random() * (5 + this.level)) + 1;
        const operator = this.operators[Math.floor(Math.random() * this.operators.length)];
        
        let startValue = Math.floor(Math.random() * 50);
        let sequence = [startValue];

        for (let i = 1; i < patternLength; i++) {
            sequence.push(this.calculateNext(sequence[i - 1], step, operator));
        }

        const correctAnswer = this.calculateNext(sequence[sequence.length - 1], step, operator);
        const options = this.generateOptions(correctAnswer);

        return { 
            sequence, 
            options, 
            correctAnswer, 
            level: this.level,
            currentPlayer: this.players[this.currentPlayerIndex] 
        };
    }

    calculateNext(current, step, op) {
        let res;
        switch (op) {
            case '+': res = current + step; break;
            case '-': res = current - step; break;
            case '*': res = current * step; break;
            case '/': res = current / step; break;
            default: res = current + step;
        }
        return Number.isInteger(res) ? res : parseFloat(res.toFixed(1));
    }

    generateOptions(correct) {
        let options = new Set([correct]);
        while (options.size < 4) {
            let variance = (Math.random() * 10 - 5).toFixed(1);
            let fake = Number(correct) + parseFloat(variance);
            fake = Number.isInteger(fake) ? fake : parseFloat(fake.toFixed(1));
            if (fake !== correct) options.add(fake);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    }

    validateAnswer(userAnswer, correctAnswer) {
        if (parseFloat(userAnswer) === parseFloat(correctAnswer)) {
            // বর্তমান প্লেয়ারের স্কোর বাড়ানো
            this.players[this.currentPlayerIndex].score += 10;
            this.level++;
            return true;
        }
        return false;
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}

export const engine = new GameEngine();
