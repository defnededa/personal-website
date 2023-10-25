/* globals Vue, systems, Vector2D */

(function () {
  let system = {
    hide: false,
    name: "trail", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "trailing particles",

    //=====================
    // tuning values
    alignmentStrength: 0.1,
    cohesionStrength: 0.1,
    separationStrength: 0.1,
    separationDistance: 20,
    trailLength: 10,
    spawnRate: 0.01,

    //=====================
    // events

    setup(p, {}) {
      // TODO  - Create the initial particles
      // How many?  Where?
      this.particles = [];
      for (var i = 0; i < 10; i++) {
        // You can use a helper function, or setup here
        let pt = new Vector2D(
          Math.random() * p.width,
          Math.random() * p.height
        );

        // Helpful: a unique ID number
        pt.idNumber = this.particles.length;

        // Basic particle info
        pt.velocity = new Vector2D(
          Math.random() * 10 - 1,
          Math.random() * 10 - 1
        );
        pt.force = new Vector2D();
        pt.trail = [];

        this.particles.push(pt);
      }
    },

    update(p, { deltaTime, time }) {
      if (Math.random() < this.spawnRate) {
        let pt = new Vector2D(
          Math.random() * p.width,
          Math.random() * p.height
        );

        pt.idNumber = this.particles.length;
        pt.velocity = new Vector2D(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        );
        pt.force = new Vector2D();
        pt.trail = [];

        this.particles.push(pt);
      }

      this.particles.forEach((pt) => {
        // Calculate forces
        let alignment = new Vector2D();
        let cohesion = new Vector2D();
        let separation = new Vector2D();
        let count = 0;

        this.particles.forEach((other) => {
          if (pt !== other) {
            let distance = pt.getDistanceTo(other);
            if (distance < this.separationDistance) {
              separation.add(Vector2D.sub(pt, other).normalize().div(distance));
              count++;
            }
            alignment.add(other.velocity);
            cohesion.add(other);
          }
        });

        if (count > 0) {
          separation.div(count);
        }

        if (alignment.magnitude > 0) {
          alignment.normalize();
        }

        if (cohesion.magnitude > 0) {
          cohesion
            .div(this.particles.length - 1)
            .sub(pt)
            .normalize();
        }

        // Apply forces
        pt.force.setToAddMultiple(
          alignment,
          this.alignmentStrength,
          cohesion,
          this.cohesionStrength,
          separation,
          this.separationStrength
        );

        // Update velocity and position
        pt.velocity.addMultiple(pt.force, deltaTime).constrain(0, 10);
        pt.addMultiple(pt.velocity, deltaTime);

        // Update trail
        pt.trail.unshift(pt.clone());
        if (pt.trail.length > this.trailLength + 200) {
          pt.trail.pop();
        }
      });
    },

    draw(p, { time, deltaTime, drawDebugInfo }) {
      this.particles.forEach((pt) => {
        // Draw the particles
        p.noStroke();
        p.fill(199, 67, 49);
        p.circle(...pt, 5);

        // Draw trail
        p.stroke(199, 67, 49);
        for (let i = 1; i < pt.trail.length; i++) {
          p.line(...pt.trail[i - 1], ...pt.trail[i]);
        }

        if (drawDebugInfo) {
          // Draw debug info for each particle
          pt.drawArrow(p, {
            v: pt.velocity.clone().mult(10),
            color: [0, 0, 255],
          });
        }
      });
    },
  };

  /*
   * Controls for this system
   */

  Vue.component(`controls-${system.name}`, {
    template: `<div>
              <label>Trail Length</label>
              <input type="range" v-model.number="system.trailLength" min="0" max="100" step="1" />
              <label>Spawn Rate</label>
              <input type="range" v-model.number="system.spawnRate" min="0" max="0.1" step="0.01" />
            </div>`,
    data() {
      return {
        system,
      };
    },
  });

  systems.push(system);
})();
