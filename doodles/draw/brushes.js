const WIDTH = 1000;
const HEIGHT = 600;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

const STARTING_COLOR0 = [160, 100, 50];
const STARTING_COLOR1 = [320, 100, 50];
const STARTING_BRUSH_SIZE = 1;

function startDrawing(p) {
  //bg color
  p.background(0, 100, 0);
}

function addMult(v0, v1, m) {
  // v0 += v1*m
  v0[0] += v1[0] * m;
  v0[1] += v1[1] * m;
}
function drawHeart(p, x, y, size) {
  p.beginShape();
  p.vertex(x, y);
  p.bezierVertex(
    x - size / 2,
    y - size / 2,
    x - size,
    y + size / 3,
    x,
    y + size
  );
  p.bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  p.endShape();
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
    label: "rainbow eraser",
    hide: false,
    description: "eraser",
    setup(p, settings) {
      // When the user clicks erase, reset the screen to a cool gradient background
      for (let i = 0; i <= WIDTH; i++) {
        let inter = p.map(i, 0, WIDTH, 0, 1);
        let c = p.lerpColor(
          p.color(STARTING_COLOR0),
          p.color(STARTING_COLOR1),
          inter
        );
        p.stroke(c);
        p.line(i, 0, i, HEIGHT);
      }
    },

    mouseDragged(p, settings) {
      // When the user drags erase, erase parts of the screen
      p.stroke(0, 100, 0); // This color matches the starting background
      p.strokeWeight(STARTING_BRUSH_SIZE * 10); // Increase the brush size for erasing
      p.line(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
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

  //hearts
  {
    label: "hearts",
    hide: false,
    description: "A brush that draws hearts discretely",
    //uses beginshape and endshapoe through drawheart, also bezier curve through drawheart
    setup(p, { color0, color1, brushSize }) {
      console.log("SETUP BRUSH");
      this.totalDist = 0;

      this.index = 0;
    },
    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;

      // Define velocity
      let vx = x - this.x0;
      let vy = y - this.y0;
      // Distance since last drag
      let d = Math.sqrt(vx ** 2 + vy ** 2);
      console.log(d);
      p.fill(333, 100, 39);
      drawHeart(p, x, y, 20);
    },
  },

  //emojis
  {
    label: "emojis",
    description: "Pink emoji brush",
    hide: false,

    mouseDragged(p, { color0, color1, brushSize }) {
      let hearts = ["💓", "💞", "💝", "💖", "🎀", "🌺", "🌸", "🐷", "👛"];
      console.log("Drag...");
      let x = p.mouseX;
      let y = p.mouseY;

      let size = 20;
      let count = 2;

      // Scale the cluster by how far we have moved since last frame
      // the "magnitude" of the (movedX, movedY) vector
      let distanceTravelled = p.mag(p.movedX, p.movedY);
      size = distanceTravelled * 2 + 10;

      // I often draw a shadow behind my brush,
      // it helps it stand out from the background
      p.noStroke();
      p.fill(0, 0, 0, 0.01);
      p.circle(x, y, size * 2);
      p.circle(x, y, size * 1);

      // Draw some emoji
      p.fill(1);

      for (var i = 0; i < count; i++) {
        // Offset a polar
        let r = size * Math.random();
        let theta = Math.random() * Math.PI * 2;
        p.textSize(size);
        let emoji = p.random(hearts);

        let x2 = x + r * Math.cos(theta);
        let y2 = y + r * Math.sin(theta);
        p.text(emoji, x2, y2);
      }
    },
  },
  //luck rainbow
  {
    label: "luck rainbow",
    hide: false,
    description: "A brush that draws a continuous rainbow line",

    setup(p, { color0, color1, brushSize }) {
      this.points = [];
    },

    mouseDragged(p, { color0, color1, brushSize }) {
      let x = p.mouseX;
      let y = p.mouseY;

      let point = {
        x: x,
        y: y,
        color: p.lerpColor(p.color(color0), p.color(color1), Math.random()),
      };
      this.points.push(point);

      p.noFill();
      p.beginShape();

      for (let i = 0; i < this.points.length; i++) {
        p.stroke(this.points[i].color);
        p.curveVertex(this.points[i].x, this.points[i].y);
      }

      p.endShape();
    },
  },
];
