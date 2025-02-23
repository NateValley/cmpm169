class Forum {
  constructor(sites) {
    this.sites = sites;
    this.center = this.calculateCenter();
    this.radius = this.calculateRadius();
  }
  
  calculateCenter() {
    let sumX = 0;
    let sumY = 0;
    
    this.sites.forEach(site => {
      sumX += site.pos.x;
      sumY += site.pos.y;
    })
    
    return createVector(sumX / this.sites.length, sumY / this.sites.length);
  }
  
  calculateRadius() {
    let maxDist = 0;
    
    for (let site of this.sites) {
      let dist = this.center.dist(site.pos);
      maxDist = Math.max(maxDist, dist);
    }
    return maxDist;
  }
  
  display() {
    noStroke();
    fill(255, 75);
    ellipse(this.center.x, this.center.y, this.radius * 2);
  }
}