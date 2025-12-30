/**
 * OMEGA AI - Verified Logic Engine V15.8
 * Features: Time Limitation, Multi-Player Turn Mgmt, Floating Point Logic
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.operators = ['+'];
        this.players = [];
        this.currentPlayerIndex = 0;
        
        // লিমিটেশন কনফিগ
        this.isPaid = false; 
        this.FREE_TIME_LIMIT = 300; // ৫ মিনিট = ৩০০ সেকেন্ড
    }

    // আজকের ব্যবহৃত সময় রিট্রিভ করা
    getUsedTime() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem('math_ai_time')) || { date: today, used: 0 };
        
        if (data.date !== today) return 0;
        return data.used;
    }

    // সময় সেভ করা
    saveTime(seconds) {
        if (this.isPaid) return; // পেইড হলে সেভ করার দরকার নেই
        const today = new Date().toDateString();
        localStorage.setItem('math_ai_time', JSON.stringify({ date: today, used: seconds }));
    }

    // মাল্টিপ্লেয়ার সেটআপ
    initPlayers(count) {
        this.players = Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            score: 0
        }));
        this.currentPlayerIndex = 0;
        this.level = 1;
        this.operators = ['+'];
    }

    // টার্ন ম্যানেজমেন্ট
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // লেভেল অনুযায়ী ডিফিকাল্টি আপডেট
    updateDifficulty() {
        if (this.level > 5 && !this.operators.includes('-')) this.operators.push('-');
        if (this.level > 15 && !this.operators.includes('*')) this.operators.push('*');
        if (this.level > 25 && !this.operators.includes('/')) this.operators.push('/');
    }

    // প্যাটার্ন জেনারেশন অ্যালগরিদম
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
            this.players[this.currentPlayerIndex].score += 10;
            this.level++;
            return true;
        }
        return false;
    }
}

export const engine = new GameEngine();
