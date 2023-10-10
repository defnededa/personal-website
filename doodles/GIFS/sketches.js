const WIDTH = 300;
const HEIGHT = 300;
const DEFAULT_FRAME_RATE = 30;
const DEFAULT_LOOP_LENGTH_IN_FRAMES = 100;

function drawClock(p, pct, size) {
  p.fill(100);
  p.noStroke();
  p.circle(0, 0, size);
  p.fill(0);
  p.arc(0, 0, size, size, 0, pct * Math.PI * 2);
}

function drawInformation(p, t, otherData) {
  p.textFont("Roboto Mono", 14); // Here 'Roboto' is the name of the font and 32 is the font size

  let x = 10;
  let y = 15;
  p.text("loop time:" + t.toFixed(2), x, y);
  otherData.forEach((text, index) => {
    p.text(text, x, y + 15 * (index + 1));
  });

  // Draw a clock face
  p.push();
  p.translate(p.width - 30, 30);
  drawClock(p, t, 30);
  p.pop();
}

// Three useful functions for animations
function pingpong(t) {
  // Return a number from 0 to 1
  // t=0 => 0
  // t=.5 => 1
  // t=1 => 0
  return 1 - Math.abs(((t * 2) % 2) - 1);
}

function pingpongEased(t) {
  // Same as pingpong, but it eases in and out
  return 0.5 - 0.5 * Math.cos(2 * t * Math.PI);
}

function ease(t) {
  // Ease just from 0 to 1 (the first half of pingpong)
  return 0.5 - 0.5 * Math.cos(t * Math.PI);
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

function drawStrawberry(p, x, y, size) {
  // Strawberry body
  p.fill(252, 58, 155); // Red color for the strawberry
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

  // Leaves on top
  p.fill(0, 128, 0); // Green color for the leaves
  p.arc(x - size / 4, y - size / 8, size / 3, size / 3, -p.PI, 0);
  p.arc(x + size / 4, y - size / 8, size / 3, size / 3, -p.PI, 0);
  p.circle(x, y - size / 5, size / 3);
  p.rect(x, y - size / 2, size / 10, size / 3);

  // Seeds
  p.fill(255, 255, 255); // White color for the seeds
  for (let i = 0; i < 8; i++) {
    let seedX = x + p.random(-size / 2.5, size / 2.5);
    let seedY = y * 1.1 + p.random(-size / 4, size / 2);
    p.ellipse(seedX, seedY, size / 10, size / 15);
  }

  // face
  p.fill(0); // Black color for the face
  p.ellipse(x - size / 4, y, size / 8, size / 8); // Left eye
  p.ellipse(x + size / 4, y, size / 8, size / 8); // Right eye
  p.arc(x, y + size / 8, size / 3, size / 4, 0, p.PI); // Mouth
}

// =================================================
const sketches = [
  // defne tries to code
  {
    name: "GIF 1",
    show: true,
    description: "Self-Portrait",
    setup(p) {
      p.createCanvas(WIDTH, HEIGHT);
      p.frameRate(DEFAULT_FRAME_RATE);
    },

    draw(p) {
      p.background(250, 185, 227);

      p.fill(252, 239, 215);
      p.noStroke();
      p.circle(WIDTH / 2, HEIGHT / 2, 200);

      let eyeSize =
        20 + 10 * pingpongEased(p.frameCount / DEFAULT_LOOP_LENGTH_IN_FRAMES);

      p.fill(6, 94, 25);

      drawHeart(p, WIDTH / 2 - 50, HEIGHT / 2 - 50, eyeSize);
      drawHeart(p, WIDTH / 2 + 50, HEIGHT / 2 - 50, eyeSize);
    },
  },
  {
    name: "GIF 2",
    show: true,
    description: "Looping Hearts",
    setup(p) {
      p.createCanvas(WIDTH, HEIGHT);
      p.frameRate(DEFAULT_FRAME_RATE);
    },

    draw(p) {
      p.background(252, 58, 155);

      p.fill(250, 185, 227);
      p.stroke(71, 69, 70);
      p.strokeWeight(5);

      let heartPositions = [
        { x: WIDTH * 0.2, y: HEIGHT * 0.1 },
        { x: WIDTH * 0.5, y: HEIGHT * 0.1 },
        { x: WIDTH * 0.8, y: HEIGHT * 0.1 },
        { x: WIDTH * 0.2, y: HEIGHT * 0.4 },
        { x: WIDTH * 0.5, y: HEIGHT * 0.4 },
        { x: WIDTH * 0.8, y: HEIGHT * 0.4 },
        { x: WIDTH * 0.2, y: HEIGHT * 0.7 },
        { x: WIDTH * 0.5, y: HEIGHT * 0.7 },
        { x: WIDTH * 0.8, y: HEIGHT * 0.7 },
      ];
      let heartSize =
        40 + 10 * pingpongEased(p.frameCount / DEFAULT_LOOP_LENGTH_IN_FRAMES);

      for (let pos of heartPositions) {
        drawHeart(p, pos.x, pos.y, heartSize);
      }
    },
  },
  {
    name: "GIF 3",
    show: true,
    description: "My Name Flying",
    setup(p) {
      p.background(250, 185, 227);
    },

    draw(p) {
      p.background(0, 0, 50, 0.01);

      let t = p.frameCount;

      for (var i = 0; i < 10; i++) {
        let x = t * 10 + i * 10;
        let y = 10 + 30 * i;

        y += 40 * Math.sin(x * 0.03);

        x = (x - 100) % (p.width + 200);

        p.stroke(0, 128, 0);
        p.strokeWeight(0.5);
        p.text("Defne", x, y);
        p.fill(252, 58, 155);
      }
    },
  },
  {
    // inspo https://www.pinterest.cl/pin/200128777180566113/
    name: "GIF 4",
    show: true,
    description: "Raining Strawberries ",
    setup(p) {},

    loopLength: DEFAULT_LOOP_LENGTH_IN_FRAMES,

    draw(p) {
      p.background(250, 185, 227);

      // Where are we in the loop?
      let t = (p.frameCount / this.loopLength) % 1;

      let border = 50;

      let count = 16;
      for (var i = 0; i < count; i++) {
        let xPct = (t + i * 0.12) % 1;
        let x = p.map(xPct, 0, 1, -border, p.width + border);
        // The y position, like the x, changes
        let yPct = (t + i * 0.39) % 1;
        let y = p.map(yPct, 0, 1, -border, p.height + border);
        //y += 20 * Math.sin(i * 2 + angle);
        // y = 100
        p.fill(50);
        if (i === 0) p.fill(0, 100, 50);
        drawStrawberry(p, x, y, 50);
      }

      // Output information about where we are in the loop
      p.fill(0, 128, 0);
      drawInformation(p, t, []);
    },
  },
  {
    name: "GIF 5",
    show: true,
    description: "Dancing Seeds!",

    // inspiration: https://www.picgifs.com/glitter-gifs/strawberry/picgifs-strawberry-6885715-1003909/

    setup(p) {
      p.createCanvas(WIDTH, HEIGHT);
      p.frameRate(DEFAULT_FRAME_RATE);
    },

    draw(p) {
      p.background(250, 185, 227);
      drawStrawberry(p, WIDTH / 2, HEIGHT / 3, 150);
    },
  },
  {
    name: "GIF 6",
    show: true,
    description: "Final Combo",

    setup(p) {
      p.createCanvas(WIDTH, HEIGHT);
      p.frameRate(DEFAULT_FRAME_RATE);
    },

    draw(p) {
      p.background(250, 185, 227);

      p.push();
      p.translate(WIDTH / 2, HEIGHT / 2);
      p.rotate(p.frameCount / 50); // Rotate based on frame count
      let strawberrySize =
        50 + 30 * pingpongEased(p.frameCount / DEFAULT_LOOP_LENGTH_IN_FRAMES);
      drawStrawberry(p, 0, 0, strawberrySize);
      p.pop();

      // Floating hearts around the strawberry
      let numHearts = 6;
      for (let i = 0; i < numHearts; i++) {
        let angle = (p.TWO_PI / numHearts) * i + p.frameCount / 100;
        let heartX = WIDTH / 2 + 150 * Math.cos(angle);
        let heartY = HEIGHT / 2 + 150 * Math.sin(angle);
        let heartSize =
          20 +
          10 *
            pingpongEased(
              (p.frameCount + i * 10) / DEFAULT_LOOP_LENGTH_IN_FRAMES
            );
        p.fill(252, 58, 155); // Heart color
        drawHeart(p, heartX, heartY, heartSize);
      }
    },
  },
];
