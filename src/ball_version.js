var canvas = (document.getElementById("myCanvas"));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var x = 10;
var y = 10;
// var dx = 1;
// var dy = 1;
var inmate = 0
var inmates = 10;
var inmatePos = []
for (let i = 0; i < inmates; i++) {
    // inmatePos[i] = { "x": 0, "y": 0, "dx": Math.random() * 1.5, "dy": Math.random() * 1.5 }
    inmatePos[i] = new Inmate(0, 0, 10)
}
var colors = ["orange", "brown", "red", "yellow"];
var personalSpace = (canvas.width * canvas.height) / inmates;
var personalWidth = Math.sqrt(personalSpace / (canvas.width / canvas.height)) * (canvas.width / canvas.height)
var personalHeight = Math.sqrt(personalSpace / (canvas.width / canvas.height))

function drawInmates() {
    inmate = 0
    y = 10
    while (inmate < inmates) {
        for (let i = 0; i + personalWidth < canvas.width && inmate < inmates; i += personalWidth) {
            ctx.beginPath();
            ctx.arc(inmatePos[inmate]["x"] += x, inmatePos[inmate]["y"] += y, inmatePos[inmate]["radius"], 0, Math.PI * 2);
            x += personalWidth
            ctx.fillStyle = colors[inmate % colors.length];
            ctx.fill();
            ctx.closePath();
            inmate++;
            x += personalWidth
            inmate++;
        }
        x = 10;
        if (y + personalHeight < canvas.height) {
            y += personalHeight;
        } else {
            y = canvas.height - 10;
        }
    }
    x = 20;
    y = 20;
}

function moveInmates() {
    inmate = 0
    while (inmate < inmates) {
        ctx.beginPath();
        ctx.arc(inmatePos[inmate]["x"], inmatePos[inmate]["y"], inmatePos[inmate]["radius"], 0, Math.PI * 2);
        ctx.fillStyle = colors[inmate % colors.length];
        ctx.fill();
        ctx.closePath();
        inmate++
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveInmates();
    inmate = 0
    while (inmate < inmates) {
        inmatePos[inmate]["x"] += inmatePos[inmate]["dx"];
        inmatePos[inmate]["y"] += inmatePos[inmate]["dy"];
        if (inmatePos[inmate]["x"] + inmatePos[inmate]["dx"] > canvas.width - inmatePos[inmate]["radius"] || inmatePos[inmate]["x"] + inmatePos[inmate]["dx"] < inmatePos[inmate]["radius"]) {
            inmatePos[inmate]["dx"] = -inmatePos[inmate]["dx"];
        }
        if (inmatePos[inmate]["y"] + inmatePos[inmate]["dy"] < inmatePos[inmate]["radius"] || inmatePos[inmate]["y"] + inmatePos[inmate]["dy"] > canvas.height - inmatePos[inmate]["radius"]) {
            inmatePos[inmate]["dy"] = -inmatePos[inmate]["dy"];
        }
        inmate++
    }
    collisionDetection();
    requestAnimationFrame(draw);
}

function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function collisionDetection() {
    for (let i = 0; i < inmates - 1; i++) {
        for (let j = i + 1; j < inmates; j++) {
            if (distance(inmatePos[i], inmatePos[j]) <= inmatePos[i]["radius"] * 2) {
                let theta1 = inmatePos[i].angle();
                let theta2 = inmatePos[j].angle();
                let phi = Math.atan2(inmatePos[j].y - inmatePos[i].y, inmatePos[j].x - inmatePos[i].x);
                let m1 = inmatePos[i].mass;
                let m2 = inmatePos[j].mass;
                let v1 = inmatePos[i].speed();
                let v2 = inmatePos[j].speed();

                let idx = (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2) * Math.cos(phi) + v1 * Math.sin(theta1 - phi) * Math.cos(phi + Math.PI / 2);
                let idy = (v1 * Math.cos(theta1 - phi) * (m1 - m2) + 2 * m2 * v2 * Math.cos(theta2 - phi)) / (m1 + m2) * Math.sin(phi) + v1 * Math.sin(theta1 - phi) * Math.sin(phi + Math.PI / 2);
                let jdx = (v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2) * Math.cos(phi) + v2 * Math.sin(theta2 - phi) * Math.cos(phi + Math.PI / 2);
                let jdy = (v2 * Math.cos(theta2 - phi) * (m2 - m1) + 2 * m1 * v1 * Math.cos(theta1 - phi)) / (m1 + m2) * Math.sin(phi) + v2 * Math.sin(theta2 - phi) * Math.sin(phi + Math.PI / 2);

                inmatePos[i]["dx"] = idx;
                inmatePos[i]["dy"] = idy;
                inmatePos[j]["dx"] = jdx;
                inmatePos[j]["dy"] = jdy;
            }
        }
    }
}

drawInmates()
draw()