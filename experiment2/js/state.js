class State {
  constructor(mem) {
    this.mem = mem;
  }
  
  enter() {}
  update() {}
  exit() {}
}

// BASE STATES ===============================

class ExploringState extends State {
  enter() {
    console.log(`${this.mem.type} is exploring`);
  }
  
  update() {
    if(this.mem.resources < 3) {
      this.mem.setState(new GatheringState(this.mem));
      return;
    }
    
    if (this.mem.resources >= 3) {
      this.mem.setState(new BuildingState(this.mem));
    }
    
    if (this.moveTarget && this.mem.pos.dist(this.moveTarget) > 4) {
      this.moveTo(this.moveTarget);
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer exploring`);
  }
}

class GatheringState extends State {
  enter() {
    console.log(`${this.mem.type} is gathering`);
  }
  
  update() {
    let sources = this.mem.findNearby().filter(obj => obj instanceof Source && obj.owner == this.mem.type);
    
    if (sources.length > 0) {  // If there is a nearby source, find closest source
      let closest = sources.reduce((prev, curr) =>
        this.mem.pos.dist(curr.pos) < this.mem.pos.dist(prev.pos) ? curr : prev
      );
      
      this.mem.setTarget(closest.pos);
      
      if (this.mem.pos.dist(closest.pos) <= 10) {  // If Mem is close enough, begin gathering
        this.mem.resources++;
      }
    } else {  // If there are no nearby ally sources, explore
      
      let unownedSources = this.mem.findNearby().filter(obj => obj instanceof Source && obj.owner == null);
      
      if (unownedSources.length > 0) {
        let closest = sources.reduce((prev, curr) =>
          this.mem.pos.dist(curr.pos) < this.mem.pos.dist(prev.pos) ? curr : prev
        );
      
        this.mem.setTarget(closest.pos);
      
        if (this.mem.pos.dist(closest.pos) <= 10) {  // If Mem is close enough, begin gathering
          closest.capture(this.mem.type, this.mem.color);
        }
      }
      
      this.mem.setState(new ExploringState(this.mem));
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer gathering`);
  }
}

class AttackingState extends State {
  constructor(mem, target) {
    super(mem);
    this.target = target;
  }

  enter() {
    console.log(`${this.mem.type} is attacking`);
  }

  update() {
    if (this.target.health <= 0) {  // If captured or killed target, go back to exploring
      
      if (this.target instanceof Source || this.target instanceof Site) {
        this.target.capture();
      } else {
        this.target.destroy();
      }
      
      this.mem.setState(new ExploringState(this.mem));
      return;
    }

    this.mem.setTarget(this.target.pos);  // If target is alive and Mem is close enough, attack target
    if (this.mem.pos.dist(this.target.pos) <= 10) {
      this.target.health--;
    }
  }

  exit() {
    console.log(`${this.mem.type} no longer attacking`);
  }
}

class BuildingState extends State {
  enter() {
    console.log(`${this.mem.type} is building`);
  }
  
  update() {
    if (this.mem.resources >= 3) {
      let nearbySites = this.mem.findNearby().filter((obj) => obj instanceof Site);
    
      if (nearbySites.length > 0) {
        let closest = nearbySites.reduce((prev, curr) =>
          this.mem.pos.dist(curr.pos) < this.mem.pos.dist(prev.pos) ? curr : prev
        );
      
        this.mem.setTarget(closest.pos);
      } else {
        this.mem.build();
        this.mem.setState(new ExploringState(this.mem));
      }
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer building`);
  }
}

// TYPE SPECIFIC STATES ======================

// Type 1
class Type1ExploringState extends ExploringState {
  update() {
    let nearbyMems = this.mem.findNearby().filter(
      (obj) => obj instanceof Type1 && obj != this.mem
    );
    
    for (let mem  of nearbyMems) {
      if (mem.group && mem.group.length < 5) {
        this.mem.group = mem.group;
        mem.group.push(this.mem);
        break;
      }
    }
    
    super.update();
  }
}

// Type 2
class Type2GatheringState extends GatheringState {
  update() {
    let sources = this.mem.findNearby().filter((obj => obj instanceof Source));
    
    if (sources.length > 0) {
      let closest = sources.reduce((prev, curr) =>
        this.mem.pos.dist(curr.pos) < this.mem.pos.dist(prev.pos) ? curr : prev
      );
    
      this.mem.setTarget(closest.pos);
      
      if (this.mem.pos.dist(closest.pos) <= 10) {
        this.mem.resources++;
      }
    } else {
        this.mem.setState(new Type2ExploringState(this.mem));
    }
  }
}

class Type2ExploringState extends ExploringState {
  update() {
    let nearbySources = this.mem.findNearby().filter((obj) => obj instanceof Source);
    
    if (nearbySources.length > 0) {
      this.mem.setState(new Type2GatheringState(this.mem));
    } else {
      super.update();
    }
  }
}

// Type 3
class Type3ExploringState extends ExploringState {
  update() {
    if (
      this.mem.homeForum &&
      this.mem.homeForum.mems.length >= this.mem.memThreshold
    ) {
      this.mem.setState(new Type3BuildingState(this.mem));
    } else {
      super.update();
    }
  }
}

class Type3BuildingState extends State {
  enter() {
    console.log(`${this.mem.type} is building`);
  }
  
  update() {
    let nearbySites = this.mem.findNearby().filter((obj) => obj instanceof Site);
    
    if (nearbySites.length > 0) {
      let farthest = nearbySites.reduce((prev, curr) =>
        this.mem.pos.dist(curr.pos) > this.mem.pos.dist(prev.pos) ? curr : prev
      );
    
      this.mem.setTarget(farthest.pos);
      this.mem.build();
    } else {
      this.mem.build();
      this.mem.setState(new ExploringState(this.mem));
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer building`);
  }
}

// Type 4
class Type4PillagingState extends State {
  enter() {
    console.log(`${this.mem.type} is pillaging`);
  }
  
  update() {
    let enemies = this.mem.findNearby().filter(
      (obj) => obj.owner != this.mem.type
    );
    
    if (enemies.length > 0) {
      let target = enemies.reduce((prev, curr) =>
        this.mem.pos.dist(curr.pos) < this.mem.pos.dist(prev.pos) ? curr : prev
      );
      
      this.mem.setState(new AttackingState(this.mem, target));
    } else {
      this.mem.setState(new ExploringState(this.mem));
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer pillaging`);
  }
}