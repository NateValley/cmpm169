// Nathaniel Valdenor


// A collection of sources in the world

class Source {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.owner = null;  // Mem that owns this resource
    this.isUnderAttack = false;
    this.color = 'gray';
    this.health = 10;
  }
  
  // Capture this source
  capture(newOwner, newColor) {
    this.health = 10;
    this.owner = newOwner;
    this.color = newColor;
    this.UnderAttack = false;
  }
  
  // Display
  display() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 15, 15);
  }
}