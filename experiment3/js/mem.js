// Nathaniel Valdenor
// The New World
// Creature (Mem) class

class Mem {
  constructor(x, y, world, type, color) {
    // BASIC PROPERTIES
    this.pos = createVector(x, y);
    this.type = type;
    this.world = world;
    this.speed = 1.5;
    this.color = color;
    this.size = 10;

    this.homeForum = null;
    this.resources = 0;
    this.resourceCap = 12;
    this.gatherWait = 1;
    this.moveTarget = this.randomPoint();

    // COMBAT
    this.health = 10;
    this.isUnderAttack = false;
    this.attacker = null;
    
    // STATE MACHINE
    this.currentState = new DefaultState(this);
  }

  // UPDATE =====================================================

  update() {
    if (this.currentState) {
      this.currentState.update();
    }
  }
  
  // STATE FUNCTION ======================================================
  
  // Set state
  setState(newState) {
    if (this.currentState) {
      this.currentState.exit();
    }
    this.currentState = newState;
    this.currentState.enter();
  }
  
  // BASIC FUNCTIONS ======================================================
  
  // // Find all nearby objects
  // findNearby() {
  //   if (!this.world || !this.world.mems) {
  //     console.warn("World or Mems are not properly initialized!");
  //     return [];
  //   }
  //   return this.world.mems.filter((obj) => this.pos.dist(obj.pos));
  // }

  findMems() {
    return this.world.mems;
  }

  findSources() {
    return this.world.sources;
  }
  
  findGroups() {
    return this.world.groups;
  }
  
  findSites() {
    return this.world.sites;
  }
  
  findForums() {
    return this.world.forums;
  }
  
  // Movement
  moveTo(target) {
    this.pos.add(p5.Vector.sub(target, this.pos).setMag(this.speed));
  }

  // Random movement point
  randomPoint() {
    let randomX = Math.random() * canvasContainer.width(); // Random X within a range
    let randomY = Math.random() * canvasContainer.height(); // Random Y within a range

    let randomPoint = createVector(randomX, randomY);
    return randomPoint;
  }

  // Set target
  setTarget(newTarget) {
    this.moveTarget = newTarget;
  }

  // Remove Mem from world
  destroy() {
    this.isUnderAttack = false;
    let index = this.world.mems.findIndex((mem) => mem == this);

    this.world.mems.splice(index, 1);
  }

  // Reproduction
  reproduce() {
    if (!this.homeForum) return; // Must be part of a forum
    this.world.addMem(this.homeForum.pos.x, this.homeForum.pos.y, this.type);
  }

  // Build a site
  build() {
    return this.world.addSite(
      this.pos.x,
      this.pos.y,
      this.world,
      this.type,
      this.color
    );
  }


  // COMBAT FUNCTIONS =====================================================

  // Capture/Take site or source
  capture(target) {
    target.owner = this;
    target.color = this.color;
    target.isUnderAttack = false;
  }

  // Defend
  // defend() {
  //   let mems = this.findMems();
  //   let nearbyType = nearby.filter(
  //     (obj) => obj.type == this.type && obj.isUnderAttack
  //   );

  //   for (let ally of nearbyType) {
  //     this.attack(ally.attacker);
  //   }
  // }

  // DISPLAY FUNCTION =====================================================

  // Display
  display() {
    stroke(0);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

// TYPE CLASSES =====================================================

class Type1 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type1', 'maroon');
    this.group = null;
    this.size = 8;
    this.speed = 2;
  }
}

class Type2 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type2', 'green');
    this.size = 12;
    this.resourceCap = 24;
    this.gatherWait = 0.2;
  }
}

class Type3 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type3', 'orange');
  }
}

class Type4 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type4', 'orchid');
  }
}
