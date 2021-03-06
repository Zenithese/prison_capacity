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
    personalHeight = Math.sqrt(personalSpace / (canvas.width / canvas.height)) - 1;
}

function drawInmates() {
    y = 10
    while (inmate < inmates) {
        for (let i = 0; i + personalWidth < canvas.width && inmate < inmates; i += personalWidth) {
            drawFrame(CYCLE_LOOP[inmatePos[inmate]["currentLoopIndex"]], inmatePos[inmate]["currentDirection"], inmatePos[inmate]["x"] += x, inmatePos[inmate]["y"] += y);
            x += personalWidth;
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
        drawFrame(CYCLE_LOOP[inmatePos[inmate]["currentLoopIndex"]], inmatePos[inmate]["currentDirection"], inmatePos[inmate]["x"], inmatePos[inmate]["y"]);
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
        if (inmatePos[inmate]["x"] + inmatePos[inmate]["dx"] > canvas.width - inmatePos[inmate]["radius"] * 3 || inmatePos[inmate]["x"] + inmatePos[inmate]["dx"] < 0) {
            inmatePos[inmate]["dx"] = -inmatePos[inmate]["dx"];
            inmatePos[inmate]["dx"] > 0 ? inmatePos[inmate]["currentDirection"] = FACING_RIGHT : inmatePos[inmate]["currentDirection"] = FACING_LEFT;
        }
        if (inmatePos[inmate]["y"] + inmatePos[inmate]["dy"] < 0 || inmatePos[inmate]["y"] + inmatePos[inmate]["dy"] > canvas.height - inmatePos[inmate]["radius"]) {
            inmatePos[inmate]["dy"] = -inmatePos[inmate]["dy"];
            inmatePos[inmate]["dy"] > 0 ? inmatePos[inmate]["currentDirection"] = FACING_DOWN : inmatePos[inmate]["currentDirection"] = FACING_UP;
        }
        inmatePos[inmate]["levee"]++
        if (inmatePos[inmate]["levee"] >= 14) {
            inmatePos[inmate]["currentLoopIndex"] = (inmatePos[inmate]["currentLoopIndex"] + 1) % 4
            inmatePos[inmate]["levee"] = 0;
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
            if (overlapping(inmatePos[i], inmatePos[j])) staticCollision(inmatePos[i], inmatePos[j])
            if (distance(inmatePos[i], inmatePos[j]) <= inmatePos[i]["radius"] + inmatePos[j]["radius"]
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

                inmatePos[i]["dx"] = idx > 1.2 ? 1.2 : idx < -1.2 ? -1.2 : idx;
                inmatePos[i]["dy"] = idy > 1.2 ? 1.2 : idy < -1.2 ? -1.2 : idy;
                inmatePos[j]["dx"] = jdx > 1.2 ? 1.2 : jdx < -1.2 ? -1.2 : jdx;
                inmatePos[j]["dy"] = jdy > 1.2 ? 1.2 : jdy < -1.2 ? -1.2 : jdy;

                // inmatePos[i]["dx"] = inmatePos[i]["dx"] > 0 ? Math.random() * -1.2 : Math.random() * 1.2;
                // inmatePos[i]["dy"] = inmatePos[i]["dy"] > 0 ? Math.random() * -1.2 : Math.random() * 1.2;
                // inmatePos[j]["dx"] = inmatePos[j]["dx"] > 0 ? Math.random() * -1.2 : Math.random() * 1.2;
                // inmatePos[j]["dy"] = inmatePos[j]["dy"] > 0 ? Math.random() * -1.2 : Math.random() * 1.2;

                if (Math.abs(inmatePos[i]["dy"]) > Math.abs(inmatePos[i]["dx"])) {
                    inmatePos[i]["dy"] > 0 ? inmatePos[i]["currentDirection"] = FACING_DOWN : inmatePos[i]["currentDirection"] = FACING_UP;
                } else {
                    inmatePos[i]["dx"] > 0 ? inmatePos[i]["currentDirection"] = FACING_RIGHT : inmatePos[i]["currentDirection"] = FACING_LEFT;
                }

                if (Math.abs(inmatePos[j]["dy"]) > Math.abs(inmatePos[j]["dx"])) {
                    inmatePos[j]["dy"] > 0 ? inmatePos[j]["currentDirection"] = FACING_DOWN : inmatePos[j]["currentDirection"] = FACING_UP;
                } else {
                    inmatePos[j]["dx"] > 0 ? inmatePos[j]["currentDirection"] = FACING_RIGHT : inmatePos[j]["currentDirection"] = FACING_LEFT;
                }

                staticCollision(inmatePos[i], inmatePos[j])
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

let img = new Image();
img.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png';
    // img.onload = function () {
    //     drawInmates();
    //     draw();
    // };