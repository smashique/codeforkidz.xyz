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

    // আজকের ব্যবহৃত সময় রিট্রিভ করা
    getUsedTime() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem('math_ai_time')) || { date: today, used: 0 };
        
        if (data.date !== today) return 0;
        return data.used;
    }

    // সময় সেভ করা
    saveTime(seconds) {
        if (this.isPaid) return; // পেইড হলে সেভ করার দরকার নেই
        const today = new Date().toDateString();
        localStorage.setItem('math_ai_time', JSON.stringify({ date: today, used: seconds }));
    }

    // বাকি লজিক (initPlayers, generatePattern) আগের মতোই থাকবে...
}
export const engine = new GameEngine();
