class Inmate {
    constructor(x, y, radius) {
        this.radius = radius;
        this.x = x;
        this.y = y;

        this.dx = Math.random() * 1.5;
        this.dy = Math.random() * 1.5;

        this.mass = this.radius * this.radius * this.radius;
        this.color = ["orange", "brown", "red", "yellow"][Math.floor(Math.random() * 4)];

        this.img = new Image();
        this.img.src = "https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png";
        
        this.currentDirection = 0;
        this.currentLoopIndex = 0;

        this.levee = 0;
    };

    // draw() {
    //     ctx.beginPath();
    //     ctx.arc(Math.round(this.x), Math.round(this.y), this.radius, 0, 2 * Math.PI);
    //     ctx.fillStyle = this.color;
    //     ctx.fill();
    //     ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    //     ctx.stroke();
    //     ctx.closePath();
    // };

    speed() {
        return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    };
    angle() {
        return Math.atan2(this.dy, this.dx);
    };
};