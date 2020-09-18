// Default mouseshape & default button set to active
let mouseShape = 'ellipse(mouseX, mouseY, 5, 5)';
let circleButton = document.getElementById('circleButton');
let squareButton = document.getElementById('squareButton');
let sizeInput = document.getElementById('size').value;
circleButton.classList.add("buttons--button__active");

function changeSize(sizeInput) {
    sizeChange = eval(sizeInput);
    console.log(sizeInput + ' ' + sizeChange);
    if (typeof sizeChange == 'number') {
        console.log('lmao');
     } else {
         document.getElementById('error').innerHTML = 'Please only enter numbers.';
     }
}


function makeMouseShapeSquare(size = '5') {
    // Set mouseshape, add class and remove from other button
    mouseShape = 'rect(mouseX, mouseY, ' + size + ')';
    squareButton.classList.add("buttons--button__active");
    circleButton.classList.remove("buttons--button__active");
    draw();
}

function makeMouseShapeEllipse(size = '5') {
    // Set mouseshape, add class and remove from other button
    mouseShape = 'ellipse(mouseX, mouseY,' + size + ' , ' + size + ')';
    circleButton.classList.add("buttons--button__active");
    squareButton.classList.remove("buttons--button__active");
    draw();
}

function setup() {
    createCanvas(500, 500);
    background(255);
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
    } else {
        fill(255);
    }
    eval(mouseShape);
}