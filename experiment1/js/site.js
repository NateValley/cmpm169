// Nathaniel Valdenor
// The New World
// Site Class

class Site {
  constructor(x, y, world, owner, color) {
    // BASIC PROPERTIES
    this.pos = createVector(x, y);
    this.health = 10;
    this.owner = owner;
    this.isUnderAttack = false;
    this.color = color;
    this.world = world;
  }
  
  // Capture this site
  capture(newOwner, newColor) {
    this.health = 10;
    this.owner = newOwner;
    this.color = newColor;
    this.UnderAttack = false;
  }
  
  // Display
  display() {
    stroke(0);
    fill(this.color);
    rect(this.pos.x, this.pos.y, 15, 15);
  }
}