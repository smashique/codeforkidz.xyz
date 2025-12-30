/**
 * OMEGA AI - Master Logic Engine V15.9
 * Features: Timer Logic, Multi-Player, Floating Point Fix
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.operators = ['+'];
        this.players = [];
        this.currentPlayerIndex = 0;
        this.isPaid = false; 
        this.FREE_TIME_LIMIT = 300; // ৫ মিনিট
    }

    // টাইম ট্র্যাকিং লজিক
    getUsedTime() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem('math_ai_time')) || { date: today, used: 0 };
        return data.date !== today ? 0 : data.used;
    }

    saveTime(seconds) {
        if (this.isPaid) return;
        const today = new Date().toDateString();
        localStorage.setItem('math_ai_time', JSON.stringify({ date: today, used: seconds }));
    }

    // মাল্টিপ্লেয়ার সেটআপ (এটি মিসিং ছিল বলে এরর আসছিল)
    initPlayers(count) {
        this.players = Array.from({ length: count }, (_, i) => ({ id: i + 1, score: 0 }));
        this.currentPlayerIndex = 0;
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    generatePattern() {
        if (this.level > 5 && !this.operators.includes('-')) this.operators.push('-');
        if (this.level > 15 && !this.operators.includes('*')) this.operators.push('*');
        
        const patternLength = 3;
        const step = Math.floor(Math.random() * 5) + 1;
        const operator = this.operators[Math.floor(Math.random() * this.operators.length)];
        let startValue = Math.floor(Math.random() * 50);
        let sequence = [startValue];

        for (let i = 1; i < patternLength; i++) {
            sequence.push(this.calculateNext(sequence[i - 1], step, operator));
        }

        const correctAnswer = this.calculateNext(sequence[sequence.length - 1], step, operator);
        return { sequence, options: this.generateOptions(correctAnswer), correctAnswer, currentPlayer: this.players[this.currentPlayerIndex] };
    }

    calculateNext(current, step, op) {
        let res = op === '+' ? current + step : op === '-' ? current - step : current * step;
        return Number.isInteger(res) ? res : parseFloat(res.toFixed(1));
    }

    generateOptions(correct) {
        let options = new Set([correct]);
        while (options.size < 4) {
            let fake = correct + (Math.floor(Math.random() * 10) - 5);
            if (fake !== correct) options.add(fake);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    }

    validateAnswer(userAnswer, correctAnswer) {
        if (parseFloat(userAnswer) === parseFloat(correctAnswer)) {
            this.players[this.currentPlayerIndex].score += 10;
            this.level++;
            return true;
        }
        return false;
    }
}
export const engine = new GameEngine();
