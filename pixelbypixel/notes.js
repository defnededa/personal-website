document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  let counter = 1;

  function sketcher(ref, callback) {
    let functionName = "sketch" + counter;
    counter++;

    window[functionName] = (p) => {
      p.setup = function () {
        p.createCanvas(WIDTH / 2, HEIGHT / 2);
        p.background(255);
        p.fill(0);
        p.stroke(255);
      };
      p.draw = function () {
        p.square(p.mouseX, p.mouseY, 50);
      };

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
            <button @click="captureStamp">Capture Stamp</button>
            <div class="stamp-selector">
              <label>Select Stamp: </label>
              <select v-model="selectedStampIndex">
                <option v-for="(stamp, index) in canvasData" :key="index" :value="index">
                  Stamp {{ index + 1 }}
                </option>
              </select>
            </div>
            <button @click="setEraser">Eraser</button>
            <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
          </div>
        </div>
      `,

    data() {
      return {
        canvases: [],
        p5Instances: [],
        canvasData: [], // Ensure there is an initial stamp,
        selectedStampIndex: 0,
        stamps: [], // Array to store each stamp's data and position
        stampSize: 200,
        isEraserActive: false,
        mainP: null,
        brushes,
        activeBrush: brushes.filter((b) => !b.hide)[1],
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
        this.canvasData.push({});
        this.$nextTick(() => {
          const index = this.canvases.length - 1;
          const ref = this.$refs[`canvas${index}`][0];

          sketcher(ref, (p) => {
            this.p5Instances[index] = p;
            p.mouseReleased = () => {
              this.updateStamp(index);
            };
          });
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
        this.mainP.background(220);

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
          p.background(220);
          p.colorMode(p.HSL);
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

document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  let counter = 1;

  function sketcher(ref, callback) {
    let functionName = "sketch" + counter;
    counter++;

    window[functionName] = (p) => {
      p.setup = function () {
        p.createCanvas(720, 200);
        p.background(255);
        p.fill(0);
        p.stroke(255);
      };
      p.draw = function () {
        p.square(p.mouseX, p.mouseY, 50);
      };
      if (typeof callback === "function") {
        callback(p);
      }
    };

    new p5(window[functionName], ref);
  }

  new Vue({
    template: `<div id="app">
          <div class="canvas-holder">
            
            <div ref="p5" />
            <div ref="newCanvasContainer" />
  
            <!-- a place to put tools (line 1 for brushes, line 2 for color + size, line 3 for stamp + stamp-eraser) -->
            <div class="tools">
              <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
              
              <div class="settings">
                <color-picker v-model="settings.color0" />
                <color-picker v-model="settings.color1" />
                <input type="range"  v-model="settings.brushSize" max=10 step=".5" />
                <label>Stamp Size: </label>
                <input type="range" v-model="stampSize" min="50" max="400" step="10" />
              </div>
  
              <button @click="captureStamp">Stamp</button>
              <button @click="setEraser">Eraser</button>
              <button @click="captureStamp">Stamp 1</button> 
            </div>
          </div>
    
        </div>`,
    mounted() {
      // Create the main P5 element
      // Create the main P5 elements
      sketcher(this.$refs.p5, (p) => {
        this.p = p;
      });
      sketcher(this.$refs.p5, (p) => {
        this.p1 = p;
      });
      /*
        new p5((p) => {
          this.p = p;
          p.frameRate(30);
  
          p.setup = () => {
            p.createCanvas(WIDTH / 2, HEIGHT / 2);
            p.colorMode(p.HSL);
            p.ellipseMode(p.RADIUS);
            this.activeBrush.setup?.(p, this.settings);
          };
  
          p.draw = () => {
            this.activeBrush.draw?.(p, this.settings);
          };
  
          p.mouseDragged = () =>
            this.activeBrush.mouseDragged?.(p, this.settings);
          p.mousePressed = () =>
            this.activeBrush.mousePressed?.(p, this.settings);
          p.mouseReleased = () =>
            this.activeBrush.mouseReleased?.(p, this.settings);
        }, this.$refs.p5);
  
        new p5((p) => {
          this.p = p;
          p.frameRate(30);
  
          p.setup = () => {
            p.createCanvas(WIDTH / 2, HEIGHT / 2);
            p.colorMode(p.HSL);
            p.ellipseMode(p.RADIUS);
            this.activeBrush.setup?.(p, this.settings);
          };
  
          p.draw = () => {
            this.activeBrush.draw?.(p, this.settings);
          };
  
          p.mouseDragged = () =>
            this.activeBrush.mouseDragged?.(p, this.settings);
          p.mousePressed = () =>
            this.activeBrush.mousePressed?.(p, this.settings);
          p.mouseReleased = () =>
            this.activeBrush.mouseReleased?.(p, this.settings);
        }, this.$refs.p5); */

      // Create the new canvas for stamping
      new p5((p) => {
        this.newP = p;
        p.frameRate(30);

        p.setup = () => {
          this.newCanvas = p.createCanvas(WIDTH, HEIGHT);
          p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);
        };

        p.mousePressed = () => {
          if (this.isEraserActive) {
            this.eraseStamp(p.mouseX, p.mouseY);
          } else {
            this.addStamp(p.mouseX, p.mouseY);
          }
        };

        p.draw = () => {
          p.clear();
          this.redrawStamps();
        };
      }, this.$refs.newCanvasContainer);
    },

    computed: {
      displayBrushes() {
        return this.brushes.filter((b) => !b.hide);
      },
    },

    methods: {
      setTool(brush) {
        console.log("Set brush", brush);
        this.activeBrush = brush;
        this.activeBrush.setup?.(this.p, this.settings);
        this.isEraserActive = false;
      },

      setEraser() {
        console.log("Eraser activated");
        this.isEraserActive = true;
      },

      captureStamp() {
        if (!this.p) {
          console.error("p5 instance not set");
          return;
        }
        //Record the stamp number
        stamp_num = 0;
        // Capture the state of the current canvas
        this.canvasData = this.p.get();
        console.log(this.canvasData);
        this.isEraserActive = false; // Reset the eraser state
        this.redrawStamps();
      },

      captureStamp1() {
        //Record the stamp number
        stamp_num = 1;
        // Capture the state of the current canvas
        this.canvasData = this.p1.get();
        this.isEraserActive = false; // Reset the eraser state
        this.redrawStamps();
      },

      addStamp(x, y) {
        if (!this.canvasData) return;

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

      redrawStamps() {
        if (!this.canvasData) return;

        if (stamp_num == 0) {
          for (let stamp of this.stamps) {
            this.newP.image(
              this.canvasData,
              stamp.x - stamp.size / 2,
              stamp.y - stamp.size / 2,
              stamp.size,
              stamp.size
            );
          }
        }
      },
    },

    data() {
      return {
        brushes,
        activeBrush: brushes.filter((b) => !b.hide)[1],
        settings: {
          brushSize: STARTING_BRUSH_SIZE,
          color0: STARTING_COLOR0.slice(),
          color1: STARTING_COLOR1.slice(),
        },
        stampSize: 200, // Default stamp size
        canvasData: null,
        stamps: [], // Array to store the positions and sizes of the stamps
        stamps1: [], // Array to store the positions and sizes of the stamps
        isEraserActive: false, // Eraser state
        stamp_num: 0,
      };
    },
    el: "#app",
  });
});
//two
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  let counter = 1;

  function sketcher(ref, callback) {
    let functionName = "sketch" + counter;
    counter++;

    window[functionName] = (p) => {
      p.setup = function () {
        p.createCanvas(720, 200);
        p.background(255);
        p.fill(0);
        p.stroke(255);
      };
      p.draw = function () {
        p.square(p.mouseX, p.mouseY, 50);
      };

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
            <div ref="mainCanvas"></div>
            <div v-for="(canvas, index) in canvases" :key="index" :ref="'canvas' + index"></div>
          </div>
          <div class="tools">
            <button @click="addCanvas">Add Canvas</button>
            <button @click="captureStamp">Capture Stamp</button>
            <div class="stamp-selector">
              <label>Select Stamp: </label>
              <select v-model="selectedStampIndex">
                <option v-for="(stamp, index) in canvasData" :key="index" :value="index">
                  Stamp {{ index + 1 }}
                </option>
              </select>
            </div>
            <button @click="applyStamp">Apply Selected Stamp</button>
          </div>
        </div>
      `,
    data() {
      return {
        canvases: [],
        p5Instances: [],
        canvasData: [],
        selectedStampIndex: null,
        stamps: [],
        stampSize: 200,
        isEraserActive: false,
      };
    },
    methods: {
      addCanvas() {
        this.canvases.push({});
        this.$nextTick(() => {
          const index = this.canvases.length - 1;
          const ref = this.$refs[`canvas${index}`][0];

          sketcher(ref, (p) => {
            this.p5Instances[index] = p;
          });
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
      applyStamp() {
        if (this.selectedStampIndex === null) return;

        const stampData = this.canvasData[this.selectedStampIndex];
        if (!stampData) return;

        this.mainP.image(stampData, 0, 0);
      },
      setEraser() {
        console.log("Eraser activated");
        this.isEraserActive = true;
      },
    },
    mounted() {
      // Create the main canvas for applying stamps
      new p5((p) => {
        this.mainP = p;
        p.frameRate(30);

        p.setup = () => {
          this.mainCanvas = p.createCanvas(720, 200);
          p.background(220);
          p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);
        };

        p.mousePressed = () => {
          if (this.isEraserActive) {
            this.eraseStamp(p.mouseX, p.mouseY);
          } else {
            this.addStamp(p.mouseX, p.mouseY);
          }
        };

        p.draw = () => {
          p.clear();
          this.redrawStamps();
        };
      }, this.$refs.mainCanvas);

      // Add initial drawing canvas
      this.addCanvas();
    },
  });
});
