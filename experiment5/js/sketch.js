// sketch.js - 
// Author: Ashley Knapp
// Date: 2-10-25
 
// Consts
const rotationScale = 0.005;

// Globals
let canvasContainer;
var centerHorz, centerVert;
let waterShader;
let isDonutFart = true;
let isCubePee = true;

function preload() {
	waterShader = loadShader("shaders/water.vert", "shaders/water.frag");
	marioImg = loadImage('./assets/MPSS_Mario.webp');
	ratImg = loadImage('./assets/ratatouilleimg.jfif');
}

function resizeScreen() {
	centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
	centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
	console.log("Resizing...");
	resizeCanvas(canvasContainer.width(), canvasContainer.height());
	// redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
	// place our canvas, making it fit our container
	canvasContainer = $("#canvas-container");
	let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
	canvas.parent("canvas-container");
	// resize canvas is the page is resized

	$(window).resize(function() {
		resizeScreen();
	});
	resizeScreen();


	// Set up shader
	noStroke();
	
	shader(waterShader);
	
	waterShader.setUniform("resolution", [canvasContainer.width, canvasContainer.height]);

	// Scale and initiate images
	imageMode(CENTER);
	marioImg.resize(0.3 * marioImg.width, 0.3 * marioImg.height);
	ratImg.resize(0.435 * ratImg.width, 0.435 * ratImg.height);


}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
	// background(255, 255, 200);
	background(200);

	// Update water texture
	waterShader.setUniform("time", millis()/100);

	resetShader();

	// Draw floating plumber
	push();
	translate(-250, 10 * sin(frameCount * 0.1), 0);
	image(marioImg, 0, 0);
	pop();
	
	// Draw floating rat
	push();
	translate(250, 10 * sin(frameCount * -0.1), 0);
	image(ratImg, 0, 0);
	pop();

	shader(waterShader);

	// Draw rotating box
	push();

	if (isCubePee) {
		changeCubeYellow();
	} else {
		changeCubeGreen()
	}

	translate(-250, 10 * sin(frameCount * 0.1), 0);
	rotateX(frameCount * rotationScale);
	rotateY(frameCount * rotationScale);
	box(centerVert/1.5);
	pop();

	// Draw rotating torus
	push();

	if(isDonutFart) {
		changeDonutGreen();
	} else {
		changeDonutYellow();
	}

	translate(250, 10 * sin(frameCount * -0.1), 0);
	rotateX(frameCount * rotationScale * 1.2);
	rotateY(frameCount * rotationScale * 1.2);
	torus(centerVert/1.8, 40);
	pop();
}

// -------------------------------------------------
function mousePressed() {
	isCubePee = !isCubePee;
	isDonutFart = !isDonutFart;
}

function changeCubeGreen() {
	waterShader.setUniform("baseColor", [0.6, 0.65, 0.3]);
	waterShader.setUniform("peakColor", [0.2, 0.5, 0.2]);
	waterShader.setUniform("alph", 0.75);
	waterShader.setUniform("speedScalar", 0.5);
	waterShader.setUniform("cellSize", 2);
}

function changeCubeYellow() {
	waterShader.setUniform("baseColor", [0.8, 0.6, 0.4]);
	waterShader.setUniform("peakColor", [0.85, 0.75, 0.5]);
	waterShader.setUniform("alph", 0.69);
	waterShader.setUniform("speedScalar", .5);
	waterShader.setUniform("cellSize", 3);
}

function changeDonutGreen() {
	waterShader.setUniform("baseColor", [0.6, 0.65, 0.3]);
	waterShader.setUniform("peakColor", [0.2, 0.5, 0.2]);
	waterShader.setUniform("alph", 0.8);
	waterShader.setUniform("speedScalar", 0.3);
	waterShader.setUniform("cellSize", 6);
}

function changeDonutYellow() {
	waterShader.setUniform("baseColor", [0.75, 0.55, 0.3]);
	waterShader.setUniform("peakColor", [0.9, 0.8, 0.5]);
	waterShader.setUniform("alph", 0.69);
	waterShader.setUniform("speedScalar", .5);
	waterShader.setUniform("cellSize", 10);
}