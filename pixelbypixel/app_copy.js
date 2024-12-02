import { StampCanvas, MainCanvas } from "./classes.js";
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">
        <div class="canvas-holder">
          
          <div ref="mainCanvasContainer" class="main-canvas"></div>

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

            <button @click="setEraser">Eraser</button>
            <button v-for="(canvas, index) in stampCanvases" @click="captureFromCanvas(index)">Capture from Canvas {{ index + 1 }}</button>
          </div>

          <div v-for="(canvas, index) in stampCanvases" :key="index" :ref="'stampCanvas' + index" class="stamp-canvas"></div>
        </div>
      </div>`,
    mounted() {
      // Create the main canvas
      this.mainCanvas = new MainCanvas(
        this.$refs.mainCanvasContainer,
        WIDTH,
        HEIGHT
      );

      // Create the stamp canvases
      this.stampCanvases = [];
      for (let i = 0; i < this.numberOfStampCanvases; i++) {
        const container = this.$refs["stampCanvas" + i][0];
        this.stampCanvases.push(
          new StampCanvas(container, WIDTH / 2, HEIGHT / 2, (data) =>
            this.captureStamp(data, i)
          )
        );
      }
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
        this.mainCanvas.isEraserActive = true;
      },

      captureStamp(data, canvasIndex) {
        console.log(`Captured from canvas ${canvasIndex}`, data);
        this.mainCanvas.addStamp(
          this.mainCanvas.p.mouseX,
          this.mainCanvas.p.mouseY,
          { data: data, size: this.stampSize }
        );
        this.mainCanvas.isEraserActive = false; // Reset the eraser state
      },

      captureFromCanvas(index) {
        this.stampCanvases[index].capture();
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
        numberOfStampCanvases: 3, // Number of small canvases for stamps
      };
    },
    el: "#app",
  });
});

/*
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

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
        this.p1 = p;
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
        //Record the stamp number
        stamp_num = 0;
        // Capture the state of the current canvas
        this.canvasData = this.p.get();
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
*/
/*
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  new Vue({
    template: `<div id="app">
        <div class="canvas-holder">
          
          <div ref="p5" />
          <div ref="newCanvasContainer" />

          <!-- a place to put tools -->
          <div class="tools">
            <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
            
            <div class="settings">
              <color-picker v-model="settings.color0" />
              <color-picker v-model="settings.color1" />
              <input type="range"  v-model="settings.brushSize" max=10 step=".5" />
              <label>Stamp Size: </label>
              <input type="range" v-model="stampSize" min="10" max="200" step="10" />
            </div>

            <button @click="captureStamp">Capture Stamp</button>
          </div>
        </div>
  
      </div>`,
    mounted() {
      // Create the main P5 element
      new p5((p) => {
        this.p = p;
        p.frameRate(30);

        p.setup = () => {
          p.createCanvas(WIDTH, HEIGHT);
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
          this.addStamp(p.mouseX, p.mouseY);
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
      },

      captureStamp() {
        // Capture the state of the current canvas
        this.canvasData = this.p.get();
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

      redrawStamps() {
        if (!this.canvasData) return;

        for (let stamp of this.stamps) {
          this.newP.image(
            this.canvasData,
            stamp.x - stamp.size / 2,
            stamp.y - stamp.size / 2,
            stamp.size,
            stamp.size
          );
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
        stampSize: 50, // Default stamp size
        canvasData: null,
        stamps: [], // Array to store the positions and sizes of the stamps
      };
    },
    el: "#app",
  });
});



document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  //const canvas = document.querySelector("#big-canvas");
  //const ctx = canvas.getContext("2d");

  //ctx.fillStyle = "pink";
  //ctx.fillRect(20, 20, 200, 150);

  //var img = document.querySelector("#stamp1");
  //ctx.drawImage(img, 50, 50);

  // We have all the elements, get one with id "app"

  new Vue({
    template: `<div id="app">
        <div class="canvas-holder">
          
          <div ref="p5" />
        
          <!-- a place to put tools -->
          <div class="tools">
  
            <button v-for="brush in displayBrushes" @click="setTool(brush)" v-html="brush.label"></button>
            
            <div class="settings">
              <color-picker v-model="settings.color0" />
              <color-picker v-model="settings.color1" />
              <input type="range"  v-model="settings.brushSize" max=10 step=".5" />
            </div>
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
          this.activeBrush.setup?.(p, this.settings);
        };

        p.draw = () => {
          this.activeBrush.draw?.(p, this.settings);
        };

        // https://p5js.org/examples/input-mouse-functions.html
        p.mouseDragged = () =>
          this.activeBrush.mouseDragged?.(p, this.settings);
        p.mousePressed = () =>
          this.activeBrush.mousePressed?.(p, this.settings);
        p.mouseReleased = () =>
          this.activeBrush.mouseReleased?.(p, this.settings);
      }, this.$refs.p5);
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
      };
    },
    el: "#app",
  });
});
*/
