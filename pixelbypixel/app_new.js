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
      sketcher();
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