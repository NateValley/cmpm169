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
    
    switch (this.owner)
    {
      case 'Type1':
        this.waitTime = 3;
        break;
      case 'Type2':
        this.waitTime = 6;
        break;
      case 'Type3':
        this.waitTime = 6;
        break;
    }
    this.waitConvert = this.waitTime * 1000;
    this.spawnCooldown = null;
  }
  
  // Capture this site
  capture(newOwner, newColor) {
    this.health = 10;
    this.owner = newOwner;
    this.color = newColor;
    this.UnderAttack = false;
  }
  
  update() {
    
    if (!this.spawnCooldown)
    {
      this.spawnCooldown = Date.now();
    }
    else
    {
      if (Date.now() - this.spawnCooldown >= this.waitConvert)
      {
        this.world.addMem(this.pos.x, this.pos.y, this.owner);
        this.spawnCooldown = null;
      }
    }
  }
  
  // Display
  display() {
    stroke(0);
    fill(this.color);
    rect(this.pos.x, this.pos.y, 15, 15);
  }
}