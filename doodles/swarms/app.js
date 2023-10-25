/**
 * Starter code
 *
 */
/* globals Vue, STARTING_COLOR0, STARTING_COLOR1, STARTING_BRUSH_SIZE, WIDTH, HEIGHT, p5, Vector2D */
// GLOBAL VALUES, CHANGE IF YOU WANT
const WIDTH = 700;
const HEIGHT = 400;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;
let systems = [];

function drawBackground(p, {}) {
  // TODO, draw any background you want here each frame
  p.background("#beeafa");
}

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  // We have all the elements, get one with id "app"

  new Vue({
    template: `<div id="app" >
			<div class="canvas-holder">
			<div ref="p5" />

			<!-- a place to put tools -->
			<div class="tools">


				<div class="column" style="max-width:120px">
					<!-- toggle on and off tools -->
					<div><input type="checkbox" v-model="settings.drawDebugInfo" />debug draw</div>
					<button v-for="system in displaySystems" 
						:class="{active:system.isActive}"
						@click="toggleSystem(system)">
							{{system.name}}
						</button>
				</div>

				
					<!-- show controls for the current active systems -->
					<div v-for="system in activeSystems" class="system-controls">
						<div class="system-controls-title">{{system.name}} controls<div>
						<component :is="'controls-' + system.name"  />
						

				</div>

			</div>

		</div>`,
    mounted() {
      // Create the P5 element
      new p5((p) => {
        // Save p to the Vue element, so we have access in other methods
        this.p = p;
        // We have a new "p" object representing the sketch
        p.frameRate(30);

        p.setup = () => {
          p.createCanvas(WIDTH, HEIGHT);
          p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);

          // Add mousePos and mouseVelocity
          p.mousePos = new Vector2D();
          p.mouseVelocity = new Vector2D();

          console.log(
            "Setting up starting systems",
            this.activeSystems.map((a) => a.name)
          );
          this.activeSystems.forEach((s) => s.setup(p, this.settings));
        };

        p.draw = () => {
          this.settings.time = p.millis() * 0.001;
          let dt = p.constrain(p.deltaTime * 0.001, 0.01, 1); // dont' simulate more than a second at a time
          this.settings.deltaTime = dt;

          drawBackground(p, this.settings);

          // Calculate current mouse pos and velocity
          p.mousePos.setTo(p.mouseX, p.mouseY);
          p.mouseVelocity.lerpTo({ x: p.movedX / dt, y: p.movedY / dt }, 0.2);

          if (!this.isPaused) {
            this.activeSystems.forEach((s) => s.update(p, this.settings));
          }
          this.activeSystems.forEach((s) => s.draw(p, this.settings));
        };

        // Handle clicking and dragging
        p.mousePressed = () => {
          // Get closest point
          let pt = findClosestParticle(this.activeSystems, p.mouseX, p.mouseY);
          console.log("FOUND CLOSEST", pt, this.activeSystems);
          if (pt) {
            this.held = pt;
            pt.isHeld = true;
          }
          // If any of the active systems have this event, trigger it
          this.activeSystems.forEach((s) =>
            s.mousePressed?.(p, this.held, this.settings)
          );
        };
        p.mouseReleased = () => {
          // If any of the active systems have this event, trigger it
          this.activeSystems.forEach((s) =>
            s.mouseReleased?.(p, this.held, this.settings)
          );

          if (this.held) {
            let m = 20;
            this.held.velocity.setTo(...p.mouseVelocity);
            this.held.isHeld = false;
          }
          this.held = undefined;
        };

        p.mouseDragged = () => {
          if (this.held) {
            this.held.setTo(p.mouseX, p.mouseY);
          }

          // Update drag pos
          p.mousePos.setTo(p.mouseX, p.mouseY);

          // If any of the active systems have this event, trigger it
          this.activeSystems.forEach((s) =>
            s.mouseDragged?.(p, this.held, this.settings)
          );
        };

        p.mouseClicked = () => {
          // If any of the active systems have this event, trigger it
          this.activeSystems.forEach((s) =>
            s.mouseClicked?.(p, this.held, this.settings)
          );
        };

        p.keyTyped = (ev) => {
          // Control pausing
          if (ev.key === " ") this.isPaused = !this.isPaused;
          this.activeSystems.forEach((s) => s.keyTyped?.(ev.key));
        };
      }, this.$refs.p5);
    },

    computed: {
      displaySystems() {
        return this.systems.filter((sys) => !sys.hide);
      },
      activeSystems() {
        return this.systems.filter((sys) => sys.isActive);
      },
    },

    methods: {
      toggleSystem(sys) {
        sys.isActive = !sys.isActive;
        if (sys.isActive) {
          console.log("activate system: ", sys.name, " - ", sys.description);
          sys.setup(this.p, this.settings);
        }
        // Save to local storage so it persists between reloads
        localStorage.setItem("active-" + sys.name, sys.isActive);
      },
    },

    data() {
      // Set all systems to inactive or the last value
      systems.forEach((sys) => {
        let val = localStorage.getItem("active-" + sys.name);
        val = val === null ? true : JSON.parse(val);

        Vue.set(sys, "isActive", val);
      });

      return {
        settings: {
          drawDebugInfo: true,
          deltaTime: 0.1,
          time: 0,
        },
        isPaused: false,
        systems,
      };
    },
    el: "#app",
  });
});
