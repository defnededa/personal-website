/* globals Vue, systems, Vector2D */

(function () {
  let system = {
    hide: false,
    name: "repulsion", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "Particles repelled by the mouse!",

    //=====================
    // tuning values
    mouseStrength: 100,

    //=====================
    // events

    setup(p, {}) {
      // TODO  - Create the initial particles
      // How many?  Where?
      this.particles = [];
      for (var i = 0; i < 20; i++) {
        // You can use a helper function, or setup here
        let pt = new Vector2D(
          Math.random() * p.width,
          Math.random() * p.height
        );

        // Helpful: a unique ID number
        pt.idNumber = this.particles.length;

        // Basic particle info
        pt.velocity = new Vector2D(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        );
        pt.force = new Vector2D();

        this.particles.push(pt);
      }
    },

    update(p, { deltaTime, time }) {
      this.particles.forEach((pt) => {
        // Calculate forces
        let mouseForce = new Vector2D();
        if (p.mouseIsPressed) {
          let mousePos = new Vector2D(p.mouseX, p.mouseY);
          mouseForce = Vector2D.sub(pt, mousePos)
            .normalize()
            .mult(this.mouseStrength);
        }

        // Apply forces
        pt.force.setToAdd(mouseForce);

        // Update velocity and position
        pt.velocity.addMultiple(pt.force, deltaTime).constrain(0, 10);
        pt.addMultiple(pt.velocity, deltaTime);
      });
    },

    draw(p, { time, deltaTime, drawDebugInfo }) {
      this.particles.forEach((pt) => {
        // Draw the particles
        p.stroke(196, 86, 86);
        p.fill(196, 92, 51);
        p.circle(...pt, 5);

        if (drawDebugInfo) {
          // Draw debug info for each particle
          pt.drawArrow(p, {
            v: pt.force.clone().mult(10),
            color: [0, 255, 0],
            startOffset: 10,
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
                <label>Mouse Strength</label>
                <input type="range" v-model.number="system.mouseStrength" min="0" max="200" step="1" />
              </div>`,
    data() {
      return {
        system,
      };
    },
  });

  systems.push(system);
})();
