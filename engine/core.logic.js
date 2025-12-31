/**
 * OMEGA AI - Geometric Logic Engine V22.0
 */
class GameEngine {
    constructor() {
        this.level = 1;
        this.isPaid = false;
        this.shapes = ['triangle', 'square', 'circle', 'pentagon', 'hexagon'];
    }

    createGeometricMission() {
        // লেভেল অনুযায়ী জটিলতা নির্ধারণ
        const shapeIndex = Math.floor(Math.random() * Math.min(this.shapes.length, Math.floor(this.level / 2) + 3));
        const targetShape = this.shapes[shapeIndex];
        const rotation = Math.floor(Math.random() * 4) * 90; // $90^{\circ}, 180^{\circ}, 270^{\circ}, 360^{\circ}$

        return {
            target: targetShape,
            rotation: rotation,
            color: this.getRandomNeonColor(),
            // অপশন হিসেবে ৪টি ভিন্ন আকৃতি
            options: this.generateGeometricOptions(targetShape)
        };
    }

    generateGeometricOptions(correctShape) {
        let opts = new Set([correctShape]);
        while (opts.size < 4) {
            opts.add(this.shapes[Math.floor(Math.random() * this.shapes.length)]);
        }
        return Array.from(opts).sort(() => Math.random() - 0.5);
    }

    getRandomNeonColor() {
        return ['#00f2ff', '#ff00ff', '#39ff14', '#ffff00'][Math.floor(Math.random() * 4)];
    }
}
export const engine = new GameEngine();
