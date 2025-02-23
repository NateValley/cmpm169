// Nathaniel Valdenor

// Their World

// The World they will live in

// Constructor
class World {
  constructor() {
    // MEMS PROPERTIES
    this.mems = [];  // List of all Mems
    this.groups = [];  // List of Type 1 groups
    
    // STRUCTURES
    this.sites = [];
    this.sources = [];
    this.forums = [];
    
    this.threshold = 100;
    
    // WORLD SIZES
    this.sizeX = 1800;
    this.sizeY = 600;
  }
  
  // Create random point in world
  randomPoint() {
    let randomX = Math.random() * this.sizeX; // Random X within a range
    let randomY = Math.random() * this.sizeY; // Random Y within a range
    
    return (createVector(randomX, randomY));
  }
  
// MEMS FUNCTIONS ===========================================
  
  // Add a Mem to the world
  addMem(x, y, type) {
    let mem;
    
    switch (type) {
      case 'Type1':
        mem = new Type1(x, y, this);
        break;
      case 'Type2':
        mem = new Type2(x, y, this);
        break;
      case 'Type3':
        mem = new Type3(x, y, this);
        break;
      case 'Type4':
        mem = new Type4(x, y, this);
        break;
      default:
        return;
    }
    
    mem.pos = createVector(x, y);
    this.mems.push(mem);
    
    console.log("Mem added!");
  }
  
  // Instantiate starting Mems
  startMems(type1, type2, type3, type4) {
    let memType1 = type1;
    let memType2 = type2;
    let memType3 = type3;
    let memType4 = type4;
    
    for (let i = 0; i < memType1; i++) {
      let randomPos = this.randomPoint();
      
      this.addMem(randomPos.x, randomPos.y, 'Type1');
    }
    
    for (let i = 0; i < memType2; i++) {
      let randomPos = this.randomPoint();
      
      this.addMem(randomPos.x, randomPos.y, 'Type2');
    }
    
    for (let i = 0; i < memType3; i++) {
      let randomPos = this.randomPoint();
      
      this.addMem(randomPos.x, randomPos.y, 'Type3');
    }
    
    for (let i = 0; i < memType4; i++) {
      let randomPos = this.randomPoint();
      
      this.addMem(randomPos.x, randomPos.y, 'Type4');
    }
  }
  
// SITE AND FORUM FUNCTIONS ===========================================
  
  // Add Site to world
  addSite(x, y, world, owner, color) {
    let newSite = new Site(x, y, world, owner, color);
    this.sites.push(newSite);
    
    this.forumCheck(newSite);
  }
  
  // Check for Forum conditions
  forumCheck(newSite) {
    let nearbySites = this.sites.filter(site => site != newSite && newSite.pos.dist(site.pos) <= 100 && site.owner == newSite.owner);
    
    if (nearbySites.length >= 2) {
      let sites = [newSite, nearbySites[0], nearbySites[1]];
      this.formForum(sites);
    }
  }
  
  // Add Forum to world
  formForum(sites) {
    let newForum = new Forum(sites);
    if (newForum) {
      this.forums.push(newForum);
    }
  }
  
// SOURCE FUNCTIONS ===========================================
  
  // Add Source to world
  addSource(x, y) {
    let newSource = new Source(x, y, 50, this);
    this.sources.push(newSource);
  }
  
  // Initialize starting Sources
  startSources(sources) {
    for (let i = 0; i < sources; i++) {
      let randomPos = this.randomPoint();
      
      this.addSource(randomPos.x, randomPos.y);
    }
  }
  
  // WORLD FUNCTIONS
  
  // Start a world with random Mems
  start() {
    this.startMems(8, 6, 4, 8);
    this.startSources(12);
  }
  
  update() {   
    for (let mem of this.mems) {
      mem.update();
    }
    console.log(this.mems);
  }
  
  display() {
    for (let mem of this.mems) {
      mem.display();
    }
    for (let site of this.sites) {
      site.display();
    }
    for (let forum of this.forums) {
      forum.display();
    }
    for (let source of this.sources) {
      source.display();
    }
  }
}