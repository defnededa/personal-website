/* globals Vue, systems, Vector2D */

(function () {
  let system = {
    hide: false,
    name: "bouncing",
    description: "Bouncing balls inside the frame",

    //=====================
    // tuning values
    ballCount: 10,
    ballRadius: 20,
    ballSpeed: 2,

    //=====================
    // events

    setup(p, {}) {
      // Create the initial balls
      this.balls = [];
      for (var i = 0; i < this.ballCount; i++) {
        this.createBall(p);
      }
    },

    createBall(p) {
      let ball = new Vector2D(
        Math.random() * p.width,
        Math.random() * p.height
      );
      ball.velocity = new Vector2D(
        Math.random() * this.ballSpeed - this.ballSpeed / 2,
        Math.random() * this.ballSpeed - this.ballSpeed / 2
      );
      this.balls.push(ball);
    },

    update(p, { deltaTime, time }) {
      this.balls.forEach((ball1, index1) => {
        // Bounce off the walls
        if (
          ball1.x - this.ballRadius < 0 ||
          ball1.x + this.ballRadius > p.width
        ) {
          ball1.velocity.x *= -1;
        }
        if (
          ball1.y - this.ballRadius < 0 ||
          ball1.y + this.ballRadius > p.height
        ) {
          ball1.velocity.y *= -1;
        }

        // Bounce off each other
        this.balls.forEach((ball2, index2) => {
          if (index1 !== index2) {
            let direction = Vector2D.sub(ball2, ball1);
            let distance = direction.magnitude;
            if (distance < this.ballRadius * 2) {
              let force = direction.normalize().mult(this.ballSpeed);
              ball1.velocity.sub(force);
              ball2.velocity.add(force);
            }
          }
        });

        // Update position
        ball1.add(ball1.velocity);
      });
    },

    draw(p, { time, deltaTime, drawDebugInfo }) {
      this.balls.forEach((ball) => {
        p.fill(196, 94, 32);
        p.stroke(196, 86, 86);
        p.circle(ball.x, ball.y, this.ballRadius * 2);
      });

      if (drawDebugInfo) {
        this.balls.forEach((ball) => {
          p.stroke(196, 96, 13);
          p.strokeWeight(2);
          p.line(
            ball.x,
            ball.y,
            ball.x + ball.velocity.x * 10,
            ball.y + ball.velocity.y * 10
          );
        });
      }
    },
  };

  Vue.component(`controls-${system.name}`, {
    template: `<div>
              
              <label>Ball Radius</label>
              <input type="range" v-model.number="system.ballRadius" min="5" max="50" step="1" />
              <label>Ball Speed</label>
              <input type="range" v-model.number="system.ballSpeed" min="1" max="10" step="0.1" />
            </div>`,
    data() {
      return {
        system,
      };
    },
  });

  systems.push(system);
})();
