// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

let img, fft, amp;

function preload() {
  img = loadImage('rowlfkermit.jfif');
  song = loadSound('I Hope That Somethin Better Comes Along - Rowlf the Dog and Kermit the Frog.mp3');
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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  song.loop();
  fft = new p5.FFT();
  fft.setInput(song);
  
  amp = new p5.Amplitude();
  amp.setInput(song);
}

function draw() {
  background(0);

  image(img, 0, 0, canvasContainer.width(), (canvasContainer.width() / img.width) * img.height);

  let spectrum = fft.analyze();
  
  let vol = amp.getLevel();
  let opacity = map(vol, 0, 0.3, 25, 425, true);
  
  // BLACK BACKGROUND
  beginShape();
  noStroke();
  fill(0, 0, 0, 250 - opacity);
  vertex(0, 0);
  vertex(width, 0);
  vertex(width, height);
  vertex(0, height);
  endShape();
  
  // Calculate color based on frequency spectrum
  let rowlfFreq = fft.getEnergy(20, 600); // Low frequencies (bass)
  let kermitFreq = fft.getEnergy(600, 2000); // Mid frequencies
  let highFreq = fft.getEnergy(2000, 20000);
  
  // Map frequencies to RGB values
  let redValue = map(rowlfFreq, 44, 107, 90, 150);  // Brownish colors for low frequencies
  let greenValue = map(kermitFreq, 20, 185, 120, 185);  // Greenish for mid frequencies
  let blueValue = map(highFreq, 18, 99, 100, 150);  // A mix for high frequencies
  
  // stroke(90, 38 ,33, 125 - opacity);
  // strokeWeight(3);
  noStroke();
  fill(redValue, greenValue, blueValue, 225 - opacity);
  
  beginShape();
  vertex(0, height);
  
  let firstX = map(0, 0, spectrum.length / 4, 0, width);
  let firstY = map(spectrum[0], 0, 125, height - 6, 0);
  curveVertex(firstX, firstY);
  curveVertex(firstX, firstY);
  curveVertex(firstX, firstY);
  
  let lastX;
  let lastY;
  
  let dampingFactor = 0.6; // Lower values make it less reactive
  for (let i = 0; i < spectrum.length / 4; i+=5)
  {
    let x = map(i , 0, spectrum.length / 4, 0, width);
    
    let y = map(spectrum[i] * dampingFactor, 0, 125, height - 8, 20);
    
    curveVertex(x, y);
    
    lastX = x;
    lastY = y;
  }
  curveVertex(lastX, lastY);
  curveVertex(lastX, lastY);
  curveVertex(lastX, lastY);
  
  vertex(width, height);
  
  endShape(CLOSE);
}