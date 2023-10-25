/* globals Vue, systems, Vector2D */

(function () {
  let system = {
    hide: false,
    name: "flow", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "flow field",

    //=====================
    // tuning values
    // tuning values
    noiseScale: 0.02,
    noiseStrength: 2,
    particleCount: 300,
    trailLength: 30,
    //=====================
    // events

    setup(p, {}) {
      // Create the initial particles
      this.particles = [];
      for (var i = 0; i < this.particleCount; i++) {
        this.createParticle(p);
      }
    },

    createParticle(p) {
      let pt = new Vector2D(Math.random() * p.width, Math.random() * p.height);
      pt.velocity = new Vector2D();
      pt.force = new Vector2D();
      pt.trail = [];
      pt.size = Math.random() * 5 + 2;
      pt.color = [
        Math.random() * 50 + 205,
        Math.random() * 50 + 205,
        Math.random() * 50 + 205,
        Math.random() * 50 + 205,
      ];
      this.particles.push(pt);
    },

    update(p, { deltaTime, time }) {
      this.particles.forEach((pt) => {
        // Calculate forces
        let xoff = pt.x * this.noiseScale;
        let yoff = pt.y * this.noiseScale;
        let angle = p.noise(xoff, yoff) * Math.PI * 2 * this.noiseStrength;
        pt.force.setToPolar(1, angle);

        // Update velocity and position
        pt.velocity.addMultiple(pt.force, deltaTime).constrain(0, 15);
        pt.addMultiple(pt.velocity, deltaTime);

        // Wrap around the screen
        pt.wrap(0, 0, p.width, p.height);

        // Update trail
        pt.trail.unshift(pt.clone());
        if (pt.trail.length > this.trailLength) {
          pt.trail.pop();
        }
      });
    },

    draw(p, { time, deltaTime, drawDebugInfo }) {
      this.particles.forEach((pt) => {
        // Draw the particles
        p.noStroke();
        p.fill(...pt.color);
        p.circle(...pt, pt.size);

        // Draw trail with sine wave pattern
        p.stroke(...pt.color);
        p.strokeWeight(pt.size);
        for (let i = 1; i < pt.trail.length; i++) {
          let x = pt.trail[i - 1].x + Math.sin(time) * 5;
          let y = pt.trail[i - 1].y + Math.cos(time) * 5;
          p.line(x, y, ...pt.trail[i]);
        }
      });

      if (drawDebugInfo) {
        // Draw the flow field
        let tileSize = 20;
        for (let x = 0; x < p.width; x += tileSize) {
          for (let y = 0; y < p.height; y += tileSize) {
            let xoff = x * this.noiseScale;
            let yoff = y * this.noiseScale;
            let angle = p.noise(xoff, yoff) * Math.PI * 2 * this.noiseStrength;
            let vx = Math.cos(angle) * tileSize * 0.5;
            let vy = Math.sin(angle) * tileSize * 0.5;
            p.stroke(0);
            p.line(x, y, x + vx, y + vy);
          }
        }
      }
    },
  };

  /*
   * Controls for this system
   */

  Vue.component(`controls-${system.name}`, {
    template: `<div>
                
                <label>Noise Strength</label>
                <input type="range" v-model.number="system.noiseStrength" min="0.1" max="5" step="0.1" />
                
            
              </div>`,
    data() {
      return {
        system,
      };
    },
    methods: {
      updateParticleCount() {
        let diff = this.system.particleCount - this.system.particles.length;
        if (diff > 0) {
          for (let i = 0; i < diff; i++) {
            this.system.createParticle(this.system.p);
          }
        } else if (diff < 0) {
          this.system.particles.length = this.system.particleCount;
        }
      },
    },
  });

  systems.push(system);
})();
