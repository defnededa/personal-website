const WIDTH = 1000;
const HEIGHT = 600;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const STARTING_COLOR0 = [160, 100, 50];
const STARTING_COLOR1 = [320, 100, 50];
const STARTING_BRUSH_SIZE = 1;
const BG_COLOR = [338, 10, 16];

function startDrawing(p) {
  //bg color
  p.background(0, 100, 0);
}

function addMult(v0, v1, m) {
  // v0 += v1*m
  v0[0] += v1[0] * m;
  v0[1] += v1[1] * m;
}

let brushes = [
  //color0 blobs
  {
    label: "blobs 1",
    hide: false,
    description: "A brush that creates blobs, discrete brush",
    setup(p, { color0, color1, brushSize }) {
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;

      let v = [x, y];
      v.velocity = [0, 0];
      v.force = [0, 20];
      this.points.push(v);
    },

    draw(p, { color0, color1, brushSize }) {
      p.background(0, 100, 0, 0.1);

      let t = p.millis() * 0.001;
      let deltaTime = 0.1;

      let center = [p.width / 2, p.height / 2];

      this.points.forEach((pt, index) => {
        // SET MY FORCES
        pt.force = [0, 20];
        let rangeForce = [center[0] - pt[0], center[1] - pt[1]];
        addMult(pt.force, rangeForce, 1);

        // MOVE THE POINT
        addMult(pt, pt.velocity, deltaTime);
        addMult(pt.velocity, pt.force, deltaTime);

        // Draw blob-like effect
        let blobSize = brushSize + p.noise(index, t) * 30;
        let alphaValue = 50 + p.noise(index, t + 100) * 150;
        //let hueValue = p.map(p.noise(index, t + 200), 0, 1, 100, 360);
        p.fill(color0, alphaValue);
        p.noStroke();
        p.ellipse(pt[0], pt[1], blobSize, blobSize);
      });
    },
  },

  //eraser
  {
    label: "clear",
    hide: false,
    description: "clearing",
    setup(p, settings) {
      // When the user clicks erase, reset the screen to a cool gradient background
      p.color(BG_COLOR);
      for (let i = 0; i <= WIDTH; i++) {
        let inter = p.map(i, 0, WIDTH, 0, 1);
        let c = p.lerpColor(p.color(BG_COLOR), p.color(BG_COLOR), inter);
        p.stroke(BG_COLOR);
        p.line(i, 0, i, HEIGHT);
      }
    },
  },

  //colo1 blobs
  {
    label: "blobs 2",
    hide: false,
    description: "A brush that creates blobs, discrete brush",
    setup(p, { color0, color1, brushSize }) {
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;

      let v = [x, y];
      v.velocity = [0, 0];
      v.force = [0, 20];
      this.points.push(v);
    },

    draw(p, { color0, color1, brushSize }) {
      p.background(0, 100, 0, 0.1);

      let t = p.millis() * 0.001;
      let deltaTime = 0.1;

      let center = [p.width / 2, p.height / 2];

      this.points.forEach((pt, index) => {
        // SET MY FORCES
        pt.force = [0, 20];
        let rangeForce = [center[0] - pt[0], center[1] - pt[1]];
        addMult(pt.force, rangeForce, 1);

        // MOVE THE POINT
        addMult(pt, pt.velocity, deltaTime);
        addMult(pt.velocity, pt.force, deltaTime);

        // Draw blob-like effect
        let blobSize = brushSize + p.noise(index, t) * 30;
        let alphaValue = 50 + p.noise(index, t + 100) * 150;
        //let hueValue = p.map(p.noise(index, t + 200), 0, 1, 100, 360);
        p.fill(color1, alphaValue);
        p.noStroke();
        p.ellipse(pt[0], pt[1], blobSize, blobSize);
      });
    },
  },
];
