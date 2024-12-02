document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  let counter = 1;

  function sketcher(ref, callback, brush, settings) {
    let functionName = "sketch" + counter;
    counter++;

    window[functionName] = (p) => {
      p.setup = function () {
        p.createCanvas(WIDTH / 2, HEIGHT / 2);
        //p.background(255);
        p.fill(0);
        p.stroke(255);
        brush.setup?.(p, settings);
      };
      p.draw = function () {
        brush.draw?.(p, settings);
      };
      p.mouseDragged = () => brush.mouseDragged?.(p, settings);
      p.mousePressed = () => brush.mousePressed?.(p, settings);
      p.mouseReleased = () => brush.mouseReleased?.(p, settings);

      if (typeof callback === "function") {
        callback(p);
      }
    };

    new p5(window[functionName], ref);
  }

  new Vue({
    el: "#app",
    template: `
        <div id="app">
          <div class="canvas-holder">
            <div ref="mainCanvas" class="main-canvas"></div>
            <div v-for="(canvas, index) in canvases" :key="index" :ref="'canvas' + index" class="dynamic-canvas"></div>
          </div>
          <div class="tools">
            <button @click="addCanvas">Add Canvas</button>
            
            <color-picker v-model="settings.color0" />
                  <color-picker v-model="settings.color1" />
                  <input type="range"  v-model="settings.brushSize" max=10 step=".5" />
                  <label>Stamp Size: </label>
                  <input type="range" v-model="stampSize" min="50" max="400" step="10" />
            <div class="stamp-selector">
              <label>Select Stamp: </label>
              <select v-model="selectedStampIndex">
                <option v-for="(stamp, index) in canvasData" :key="index" :value="index">
                  Stamp {{ index + 1 }}
                </option>
              </select>
            </div>
            <button @click="setEraser">Eraser</button>
            <button @click="captureStamp">Stamp</button>
            <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
          </div>
        </div>
      `,

    data() {
      return {
        canvases: [],
        p5Instances: [],
        canvasData: [], // Ensure there is an initial stamp
        selectedStampIndex: 0, // Initialize to 0 to start with Stamp 1 selected
        stamps: [], // Array to store each stamp's data and position
        stampSize: 200,
        isEraserActive: false,
        mainP: null,
        brushes,
        activeBrush: brushes.filter((b) => !b.hide)[0],
        settings: {
          brushSize: STARTING_BRUSH_SIZE,
          color0: STARTING_COLOR0.slice(),
          color1: STARTING_COLOR1.slice(),
        },
      };
    },
    methods: {
      addCanvas() {
        this.canvases.push({});
        this.canvasData.push({}); // Add a placeholder for the new canvas data
        this.$nextTick(() => {
          const index = this.canvases.length - 1;
          const ref = this.$refs[`canvas${index}`][0];

          sketcher(
            ref,
            (p) => {
              this.p5Instances[index] = p;
              p.mouseReleased = () => {
                this.updateStamp(index);
              };
            },
            this.activeBrush,
            this.settings
          );
        });
      },
      captureStamp() {
        this.p5Instances.forEach((p, index) => {
          if (p) {
            this.canvasData[index] = p.get();
            console.log(`Captured canvas ${index}:`, this.canvasData[index]);
          }
        });
        this.isEraserActive = false;
      },
      updateStamp(index) {
        if (this.p5Instances[index]) {
          this.canvasData[index] = this.p5Instances[index].get();
          this.updateMainCanvasStamps();
        }
      },
      applyStamp(x, y) {
        if (this.selectedStampIndex === null) return;

        const stampData = this.canvasData[this.selectedStampIndex];
        if (!stampData) return;

        const newStamp = {
          img: stampData,
          x: x,
          y: y,
          size: this.stampSize,
          stampIndex: this.selectedStampIndex,
        };

        this.stamps.push(newStamp);
        this.redrawStamps();
      },
      setEraser() {
        console.log("Eraser activated");
        this.isEraserActive = true;
      },
      setTool(brush) {
        console.log("Set brush", brush);
        this.activeBrush = brush;
        this.activeBrush.setup?.(this.mainP, this.settings);
        this.isEraserActive = false;
      },
      handleMainCanvasClick(p) {
        p.mousePressed = () => {
          if (this.isEraserActive) {
            this.eraseStamp(p.mouseX, p.mouseY);
          } else {
            this.applyStamp(p.mouseX, p.mouseY);
          }
        };
      },
      addStamp(x, y) {
        if (!this.canvasData[this.selectedStampIndex]) return;

        const stamp = {
          x: x,
          y: y,
          size: this.stampSize,
        };
        this.stamps.push(stamp);
        this.redrawStamps();
      },
      eraseStamp(x, y) {
        const stampToRemove = this.stamps.findIndex(
          (stamp) =>
            x > stamp.x - stamp.size / 2 &&
            x < stamp.x + stamp.size / 2 &&
            y > stamp.y - stamp.size / 2 &&
            y < stamp.y + stamp.size / 2
        );

        if (stampToRemove !== -1) {
          this.stamps.splice(stampToRemove, 1);
          this.redrawStamps();
        }
      },
      updateMainCanvasStamps() {
        this.stamps.forEach((stamp) => {
          stamp.img = this.canvasData[stamp.stampIndex];
        });
        this.redrawStamps();
      },
      redrawStamps() {
        if (!this.mainP) return;

        this.mainP.clear();
        this.mainP.background(255, 255, 255);

        this.stamps.forEach((stamp) => {
          this.mainP.image(
            stamp.img,
            stamp.x - stamp.size / 2,
            stamp.y - stamp.size / 2,
            stamp.size,
            stamp.size
          );
        });
      },
    },
    mounted() {
      // Create the main canvas for applying stamps
      new p5((p) => {
        this.mainP = p;
        p.frameRate(30);

        p.setup = () => {
          this.mainCanvas = p.createCanvas(WIDTH, HEIGHT);
          p.background(255, 255, 255); //make this changable later
          //p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);
        };

        this.handleMainCanvasClick(p);

        p.draw = () => {
          this.redrawStamps();
        };
      }, this.$refs.mainCanvas);

      // Add initial drawing canvas
      this.addCanvas();
    },
    computed: {
      displayBrushes() {
        return this.brushes.filter((b) => !b.hide);
      },
    },
  });
});

eraseStamp(x, y);
{
  let closestStampIndex = -1;
  let closestDistance = Infinity;

  this.stamps.forEach((stamp, index) => {
    const dx = x - stamp.x;
    const dy = y - stamp.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (
      x > stamp.x - stamp.size / 2 &&
      x < stamp.x + stamp.size / 2 &&
      y > stamp.y - stamp.size / 2 &&
      y < stamp.y + stamp.size / 2
    ) {
      if (
        distance < closestDistance ||
        (distance === closestDistance && index > closestStampIndex)
      ) {
        closestDistance = distance;
        closestStampIndex = index;
      }
    }
  });

  if (closestStampIndex !== -1) {
    this.stamps.splice(closestStampIndex, 1);
    this.redrawStamps();
  }
}
