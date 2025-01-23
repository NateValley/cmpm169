// Nathaniel Valdenor
// The New World
// Creature (Mem) class

class Mem {
  constructor(x, y, world, type, color) {
    // BASIC PROPERTIES
    this.pos = createVector(x, y);
    this.type = type;
    this.world = world;
    this.speed = 1;
    this.color = color;

    this.homeForum = null;
    this.resources = 3;
    this.moveTarget = this.randomPoint();

    // COMBAT
    this.health = 10;
    this.isUnderAttack = false;
    this.attacker = null;
    
    // STATE MACHINE
    switch (type) {
      case 'Type1':
        this.currentState = new Type1ExploringState(this);
        break;
      case 'Type2':
        this.currentState = new Type2ExploringState(this);
        break;
      case 'Type3':
        this.currentState = new Type3ExploringState(this);
        break;
      case 'Type4':
        this.currentState = new Type4PillagingState(this);
        break;
      default:
        this.currentState = new ExploringState(this);
    }
  }

  // UPDATE =====================================================

  update() {
    if (this.currentState) {
      this.currentState.update();
    }
    
    if (this.pos.dist(this.moveTarget) > 4) {
      this.moveTo(this.moveTarget);
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
  
  // Find all nearby objects
  findNearby() {
    if (!this.world || !this.world.mems) {
    console.warn("World or Mems are not properly initialized!");
    return [];
  }
    return this.world.mems.filter((obj) => this.pos.dist(obj.pos) <= 200);
  }

  // Movement
  moveTo(target) {
    this.pos.add(p5.Vector.sub(target, this.pos).setMag(this.speed));
  }

  // Random movement point
  randomPoint() {
    let randomX = Math.random() * 790; // Random X within a range
    let randomY = Math.random() * 590; // Random Y within a range

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
    this.world.addSite(
      this.pos.x,
      this.pos.y,
      this.world,
      this.type,
      this.color
    );
    this.resources -= 3;
  }


  // COMBAT FUNCTIONS =====================================================

  // Capture/Take site or source
  capture(target) {
    target.owner = this;
    target.color = this.color;
    target.isUnderAttack = false;
  }

  // Defend
  defend() {
    let nearby = this.findNearby();
    let nearbyType = nearby.filter(
      (obj) => obj.type == this.type && obj.isUnderAttack
    );

    for (let ally of nearbyType) {
      this.attack(ally.attacker);
    }
  }

  // DISPLAY FUNCTION =====================================================

  // Display
  display() {
    stroke(0);
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}

// TYPE CLASSES =====================================================

class Type1 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type1', 'maroon');
    this.group = null;
  }
}

class Type2 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type2', 'blue');
  }
}

class Type3 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type3', 'orange');
    this.memThreshold = 5;
  }
}

class Type4 extends Mem {
  constructor(x, y, world) {
    super(x, y, world, 'Type4', 'orchid');
  }
}
