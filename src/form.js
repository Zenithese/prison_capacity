var textWrapper = document.querySelector('.ml12letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

var animation = anime.timeline({})
    .add({
        targets: '.ml12 .letter',
        // targets: '.ml12',
        // translateX: [40, 0],
        // translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el, i) => 500 + 30 * i,
        complete: () => animation.pause()
    })
    // .add({
    //     targets: '.ml12numbers',
    //     // translateX: [0, -30],
    //     opacity: [1, 0],
    //     easing: "easeInOutExpo",
    //     duration: 1100,
    //     delay: 0,
    // })
    .add({
        targets: '.ml12 .letter',
        // translateX: [0, -30],
        opacity: [1, 0],
        easing: "easeInExpo",
        duration: 1100,
        delay: (el, i) => 100 + 30 * i,
    });

var number = anime({
    targets: '.ml12numbers',
    // translateX: [0, -30],
    opacity: [1, 0],
    easing: "easeInOutExpo",
    duration: 1100,
    autoplay: false,
    delay: 500,
})

function setOccupancy() {
    inmates = Number(document.querySelector('#number').value)
    // var numberWrapper = document.querySelector('.ml12numbers');
    // numberWrapper.innerHTML = document.querySelector('#number').value;
    // numberWrapper.innerHTML = numberWrapper.textContent.replace(/\S/g, "<span class='number'>$&</span>");
    // console.log(numberWrapper.innerHTML)
    animation.play()
    number.play()
    setInmates();
    drawInmates();
    draw();
}