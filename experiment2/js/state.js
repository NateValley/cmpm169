class State {
  constructor(mem) {
    this.mem = mem;
  }
  
  enter() {}
  update() {}
  exit() {}
  
  randomDecision(states, weights) {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0); // Sum of all weights
    const random = Math.random() * totalWeight; // Get a random number between 0 and totalWeight

    let accumulatedWeight = 0;

    for (let i = 0; i < states.length; i++) {
      accumulatedWeight += weights[i];

      if (random < accumulatedWeight) {
        return states[i];
      }
    }
  }
}

// BASE STATES ===============================

class DefaultState extends State {
  enter() {
    console.log(`${this.mem.type} entered DefaultState`);
  }
  
  update() {
    switch (this.mem.type) {
      case 'Type1':
        this.mem.setState(new Type1DefaultState(this.mem));
        break;
      case 'Type2':
        this.mem.setState(new Type2DefaultState(this.mem));
        break;
      case 'Type3':
        this.mem.setState(new Type3DefaultState(this.mem));
        break;
      case 'Type4':
        this.mem.setState(new Type4DefaultState(this.mem));
        break;
    }
  }
  
  exit() {
    console.log(`${this.mem.type} has switched off DefaultState`);
  }
}  // DONE

class ExploringState extends State {
  enter() {
    console.log(`${this.mem.type} is exploring`);
    this.randomPoint = this.mem.randomPoint();
    this.waitTime = 0.5;
    this.waitConvert = this.waitTime * 1000;
    this.timeArrived = null;
  }
  
  update() {
    if (this.mem.pos.dist(this.randomPoint) > 2)
    {
      this.mem.moveTo(this.randomPoint);
    }
    else
    {
      if (!this.timeArrived)
      {
        console.log(`${this.mem.type} arrived!`);
        this.timeArrived = Date.now();
      }
      else
      {
        if (Date.now() - this.timeArrived >= this.waitConvert)
        {
          this.mem.setState(new DefaultState(this.mem));  
        }
      }
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer exploring`);
  }
}  // DONE

class GatheringState extends State {
  enter() {
    console.log(`${this.mem.type} is thinking about gathering`);
    this.waitTime = this.mem.gatherWait;
    this.waitConvert = this.waitTime * 1000;
    this.gatherCooldown = null;
    this.gathered = 0;
    this.gatherGoal = (Math.random() + 1) * 6;  // Randomly generates how much they gather at a time
  }
  
  update() {
    if(this.mem.resources < this.mem.resourceCap) {
      var sources = this.mem.findSources();
      
      var closest = null;
      var closestDist = 5000;
      
      for(var i = 0; i < sources.length; i++)
      {
        var distance = this.mem.pos.dist(sources[i].pos);
        if (distance < closestDist)
        {
          closestDist = distance;
          closest = sources[i];
        }
      }
      
      if(closestDist >= 15)
      {  
        this.mem.moveTo(closest.pos); 
      }
      else 
      {
        if (!this.gatherCooldown)
        {
          this.gatherCooldown = Date.now();
        }
        else
        {
          if (Date.now() - this.gatherCooldown >= this.waitConvert)
          {
            this.mem.resources++;
            this.gathered++;
            closest.resources--;
            console.log(`${this.mem.type} gathered!`)
            this.gatherCooldown = null;
          
            if (this.gathered >= this.gatherGoal)
            {
              this.mem.setState(new ExploringState(this.mem));
            }
          }
        }
      }
    } 
    else
    {
      this.mem.setState(new ExploringState(this.mem));
    }
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer gathering`);
  }
} // DONE

class AttackingState extends State {
  constructor(target) {
    this.target = target;
  }

  enter() {
    console.log(`${this.mem.type} is attacking`);
  }

  update() {
    if (this.target.health <= 0)
    {  // If captured or killed target, go back to default
      
      if (this.target instanceof Site)
      {
        this.target.capture();
      }
      else
      {
        this.target.destroy();
      }
      this.mem.setState(new DefaultState(this.mem));
    }

    if (this.mem.pos.dist(this.target.pos) <= 10)
    {
      this.target.health--;
    }
    else
    {
      this.mem.moveTo(this.target.pos);
    }
  }

  exit() {
    console.log(`${this.mem.type} no longer attacking`);
  }
}

class BuildingState extends State {
  enter() {
    console.log(`${this.mem.type} is thinking of building`);
  }
  
  update() {
    if (this.mem.resources >= 4)
    {
        this.mem.resources -= 4;
        this.mem.build();
    }
    this.mem.setState(new ExploringState(this.mem));
  }
  
  exit() {
    console.log(`${this.mem.type} is no longer building`);
  }
}

// TYPE SPECIFIC STATES ======================

// Type 1
class Type1DefaultState extends State {
  enter() {
    this.groupNum = null;
  }
  
  update() {
    let groups = this.mem.findGroups();
    
    if (groups.length == 0)
    {
      let newGroup = [this.mem];
      this.mem.group = newGroup;
      this.mem.world.groups.push(newGroup);
    }
    
    if (this.mem.group == null)
    {
      let assignedGroup = false;
      
      for (let group of groups) {
        if (group.length < 3)
        {
          this.mem.group = group;
          group.push(this.mem);
          this.groupNum = group.length - 1;
          console.log(`Added ${this.mem.type} to group ${groups.length}`);
          assignedGroup = true;
          break;
        }
      }
      
      if (!assignedGroup)
      {
        let newGroup = [this.mem];
        this.mem.group = newGroup;
        this.mem.world.groups.push(newGroup);
        this.groupNum = 0;
        assignedGroup = true;
      }
    }
    else
    {
      if (this.mem.pos.dist(this.mem.group[0].pos) >= 12 * this.groupNum && this.groupNum > 0)
      {
        this.mem.moveTo(this.mem.group[0].pos);
      }
      else
      {
        if (this.mem == this.mem.group[0])
        {
          const weights = [1, 4, 5]  // Wander, Gather, Build
          const states = [ (new ExploringState(this.mem)),
                            (new GatheringState(this.mem)),
                             (new BuildingState(this.mem))];
          
          const randomState = this.randomDecision(states, weights);
          this.mem.setState(randomState);
        }
      }
    }
  }
}

// Type 2
class Type2DefaultState extends State {
  update() {
    const weights = [2, 5, 3]  // Wander, Gather, Build
    const states = [ (new ExploringState(this.mem)),
                      (new GatheringState(this.mem)),
                       (new BuildingState(this.mem))];
          
    const randomState = this.randomDecision(states, weights);
    this.mem.setState(randomState);
  }
}

// Type 3
class Type3DefaultState extends State {
  update() {
    const weights = [2, 2, 6]  // Wander, Gather, Build
    const states = [ (new ExploringState(this.mem)),
                      (new GatheringState(this.mem)),
                       (new Type3BuildingState(this.mem))];
          
    const randomState = this.randomDecision(states, weights);
    this.mem.setState(randomState);
  }
}

class Type3BuildingState extends State {
  enter() {
    console.log(`${this.mem.type} is building`);
    this.site = null;
    this.radius = Math.random() * 30;
    this.angle = Math.random() * 2 * Math.PI;
    this.offX = Math.cos(this.angle) * this.radius;
    this.offY = Math.sin(this.angle) * this.radius;
  }
  
  update() {
    let forums = this.mem.findForums();
    
//     if (forums.length == 0)
//     {
//       if (this.mem.resources >= 4)
//       {
//         this.site = this.mem.build();
        
//         let newForum = [];
//         newForum.push(this.site);
//         console.log(`${newForum}`);
//         this.mem.world.forums.push(newForum);
//       }
//       this.mem.setState(new ExploringState(this.mem));
//     }
    
    if (!this.site && this.mem.resources >= 2)
    {
//       let assignedForum = false;
      
//       for (let forum of forums) {
//         if (forum.length < 3)
//         { 
//           let nearbyPoint = createVector(forum[0].pos.x + this.offX, forum[0].pos.y + this.offY);

//           if (this.mem.pos.dist(nearbyPoint) >= 10)
//           {
//             this.mem.moveTo(nearbyPoint);
//           }
//           else
//           {
//             this.site = this.mem.build();
//             forum.push(this.site);
//             assignedForum = true;
//             this.mem.setState(new ExploringState(this.mem));
//           }
//         }
        
//         if (!assignedForum)
//         {
//           if (this.mem.resources >= 4)
//           {
//             this.site = this.mem.build();
          
//             let newForum = [];
//             newForum.push(this.site);
//             forums.push(newForum);
//             assignedForum = true;
//           }
//         }
//       }
      this.site = this.mem.build();
      this.mem.resources -= 2;
    }
    this.mem.setState(new ExploringState(this.mem));
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