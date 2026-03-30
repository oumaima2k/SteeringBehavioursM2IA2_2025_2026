class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.r = 50; // rayon de la cible
    this.color = "green";
    this.vel = p5.Vector.random2D(); // vitesse initiale aléatoire
    // Vitesse max aléatoire enter 1 et 6
    this.vel.setMag(random(1, 6));

    // cercle de detection pour fuir
    this.rayonDetection = 100;

    this.startDeplacementsAleatoires();
  }

  startDeplacementsAleatoires() {
    this.mode = "aleatoire";

    // on ne relance pas le setInterval si il est déjà lancé,
    // sinon on va avoir plein de setInterval qui se lancent et ça va
    // être le bazar
    if (this.isSetIntervalLance()) return;

    this.id = setInterval(() => {
      // Changer la direction de la vitesse aléatoirement toutes les 500 ms
      this.vel = p5.Vector.random2D();
      this.vel.setMag(random(1, 20));
      this.maxSpeed = this.vel.mag();
      // change le rayon aussi
      this.r = random(20, 50);
      // et de couleur
      this.color = color(random(255), random(255), random(255));
      // et l'accélération
      this.acc = p5.Vector.random2D();
      this.acc.setMag(random(1, 5));
      this.maxForce = this.acc.mag();
    }, 1000);
  }

  fleeVehicles(vehicles) {
    // on cherche le véhicule le plus proche
    let closestVehicle = this.getClosestVehicle(vehicles);

    if (closestVehicle) {
      // si le véhicule le plus proche est à moins de rayonDetection,
      // on fuit

      // je mémorise la vitesse et la force max avant de les
      // changer pour fuir
      this.oldMaxSpeed = this.maxSpeed;
      this.oldMaxForce = this.maxForce;

      if (this.pos.dist(closestVehicle.pos) < this.rayonDetection) {
        // on fuit vite
        this.maxSpeed = 20;
        // on calcule la force de fuite
        this.maxForce = 10;
        let force = this.flee(closestVehicle.pos);
        this.applyForce(force);

        // on arrête les déplacements aléatoires
        this.stopDeplacementsAleatoires();
      } else {
        // on arrête de fuir que lorsque on est à trois fois
        // le rayon de detection, pour éviter que la cible ne se mette à fuir et s'arrêter de fuir en permanence
        if (this.pos.dist(closestVehicle.pos) < this.rayonDetection * 3) {
          // on continue à fuir
          // sinon on remet les vitesses et forces max d'avant
          this.maxSpeed = this.oldMaxSpeed;
          this.maxForce = this.oldMaxForce;

          // sinon on reste ou on repart en déplacements aléatoires
          this.startDeplacementsAleatoires();
        }
      }
    }
  }

  getClosestVehicle(vehicles) {
    let closestVehicle = null;
    let closestDistance = Infinity;

    vehicles.forEach((vehicle) => {
      let distance = this.pos.dist(vehicle.pos);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestVehicle = vehicle;
      }
    });

    return closestVehicle;
  }

  isSetIntervalLance() {
    return this.id !== null;
  }

  stopDeplacementsAleatoires() {
    if (!this.isSetIntervalLance()) return;

    clearInterval(this.id);
    this.id = null;
  }

  /*
  update() {
    this.vel.setHeading(this.vel.heading() + random(-0.2, 0.2)); // changement aléatoire de direction
    super.update();

  }
    */

  show() {
    fill(this.color);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);

    // on dessine le rayon de detection
    noFill();
    stroke(this.color);
    circle(this.pos.x, this.pos.y, this.rayonDetection * 2);
  }
}
