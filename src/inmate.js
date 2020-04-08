class Inmate {
    constructor(x, y, radius) {
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.dx = Math.random() * 1.2 * (Math.random() >= .5 ? 1 : -1);
        this.dy = Math.random() * 1.2 * (Math.random() >= .5 ? 1 : -1);

        this.mass = this.radius * this.radius * this.radius;
        this.color = ["orange", "brown", "red", "yellow"][Math.floor(Math.random() * 4)];

        this.img = new Image();
        this.img.src = "https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png";
        
        this.currentDirection = Math.abs(this.dx) > Math.abs(this.dy) ? this.dx > 0 ? 3 : 2 : this.dy > 0 ? 0 : 1;
        this.currentLoopIndex = 0;

        this.levee = 0;
    };

    speed() {
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    };
    angle() {
        return Math.atan2(this.dy, this.dx);
    };
};