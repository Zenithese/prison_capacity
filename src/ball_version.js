var canvas = (document.getElementById("myCanvas"));
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext("2d");
var x = 10;
var y = 10;
var inmate = 0
var inmates;
var inmatePos;
var personalSpace;
var personalWidth;
var personalHeight;

function setInmates() {
    inmate = 0;
    inmatePos = [];
    for (let i = 0; i < inmates; i++) {
        inmatePos[i] = new Inmate(0, 0, 8, i);
    }
    personalSpace = (canvas.width * canvas.height) / inmates;
    personalWidth = Math.sqrt(personalSpace / (canvas.width / canvas.height)) * (canvas.width / canvas.height);
    personalHeight = Math.sqrt(personalSpace / (canvas.width / canvas.height));
}

function drawInmates() {
    inmate = 0
    y = 10
    while (inmate < inmates) {
        for (let i = 0; i + personalWidth < canvas.width && inmate < inmates; i += personalWidth) {
            ctx.beginPath();
            ctx.arc(inmatePos[inmate]["x"] += x, inmatePos[inmate]["y"] += y, inmatePos[inmate]["radius"], 0, Math.PI * 2);
            x += personalWidth
            ctx.fillStyle = ["orange", "brown", "red", "yellow"][Math.floor(Math.random() * 4)];
            ctx.fill();
            ctx.closePath();
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
        ctx.fillStyle = ["orange", "brown", "red", "yellow"][Math.floor(Math.random() * 4)];
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
            if (overlapping(inmatePos[i], inmatePos[j])) burst(inmatePos[i], inmatePos[j])
            if (distance(inmatePos[i], inmatePos[j]) <= inmatePos[i]["radius"] * 2
            && !overlapping(inmatePos[i], inmatePos[j])) {
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

                burst(inmatePos[i], inmatePos[j])
            }
        }
    }
}

function overlapping(ob1, ob2) {
    return ob1.overlapped[ob2.id] && ob2.overlapped[ob1.id];
}

function staticCollision(ob1, ob2) {
    if (distance(ob1, ob2) < ob1.radius + ob2.radius) {
        ob1.overlapped[ob2.id] = true;
        ob2.overlapped[ob1.id] = true;
    } else if (distance(ob1, ob2) > ob1.radius + ob2.radius && overlapping(ob1, ob2)) {
        ob1.overlapped[ob2.id] = false;
        ob2.overlapped[ob1.id] = false;
    }
}

// just a fun visual
function burst(ob1, ob2) {
    while (distance(ob1, ob2) < ob1.radius + ob2.radius) {
        ob1.x += ob1.dx
        ob1.y += ob1.dy
        ob2.x += ob2.dx
        ob2.y += ob2.dy
    }
}

drawInmates()
draw()