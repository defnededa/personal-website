let counter = 1;
function namer(p) {
  let functionName = "sketch" + counter;
  counter++;
  return functionName;
}

function sketcher(p) {
  let functionName = "sketch" + counter;
  counter++;
  window[functionName] = function (p) {
    p.setup = function () {
      p.createCanvas(720, 200);
      p.colorMode(p.HSL);
      p.ellipseMode(p.RADIUS);
      this.activeBrush.setup?.(p, this.settings);
    };
    p.draw = function () {
      this.activeBrush.draw?.(p, this.settings);
    };
    p.mouseDragged = () => this.activeBrush.mouseDragged?.(p, this.settings);
    p.mousePressed = () => this.activeBrush.mousePressed?.(p, this.settings);
    p.mouseReleased = () => this.activeBrush.mouseReleased?.(p, this.settings);
  };
  new p5(window[functionName]);
}

new p5((functionName) => {
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

  p.mouseDragged = () => this.activeBrush.mouseDragged?.(p, this.settings);
  p.mousePressed = () => this.activeBrush.mousePressed?.(p, this.settings);
  p.mouseReleased = () => this.activeBrush.mouseReleased?.(p, this.settings);
}, this.$refs.p5);
// Function for first canvas
function sketch1(p) {
  p.setup = function () {
    p.createCanvas(720, 200);
    p.background(0);
  };
  p.draw = function () {
    p.circle(p.mouseX, p.mouseY, 50);
  };
}

// Run first p5 instance
new p5(sketch1);

// Function for second canvas
function sketch2(p) {
  p.setup = function () {
    p.createCanvas(720, 200);
    p.background(255);
    p.fill(0);
    p.stroke(255);
  };
  p.draw = function () {
    p.square(p.mouseX, p.mouseY, 50);
  };
}

// Run second p5 instance
new p5(sketch2);

export class StampCanvas {
  constructor(p, stamp_num, width, height, draw, frameRate) {
    this.p = p;
    this.stamp_num = stamp_num;
    this.width = this.p.width;
    this.height = this.p.height;
    this.frameRate = this.p.frameRate;
  }
}
/*
export class StampCanvas {
  constructor(container, width, height, onCapture) {
    this.width = width;
    this.height = height;
    
    this.canvas = null;

    new p5((p) => {
      this.p = p;
      p.frameRate(30);

      p.setup = () => {
        this.canvas = p.createCanvas(width, height);
        p.colorMode(p.HSL);
        p.ellipseMode(p.RADIUS);
      };

      p.draw = () => {
        // something maybe
      };
    }, container);
  }

}


export class MainCanvas {
  constructor(container, width, height) {
    this.width = width;
    this.height = height;
    this.stamps = [];
    this.isEraserActive = false;

    new p5((p) => {
      this.p = p;
      p.frameRate(30);

      p.setup = () => {
        this.canvas = p.createCanvas(width, height);
        p.colorMode(p.HSL);
        p.ellipseMode(p.RADIUS);
      };

      p.draw = () => {
        p.clear();
        this.redrawStamps(p);
      };

      p.mousePressed = () => {
        if (this.isEraserActive) {
          this.eraseStamp(p.mouseX, p.mouseY);
        } else {
          this.addStamp(p.mouseX, p.mouseY);
        }
      };
    }, container);
  }

  addStamp(x, y, stampData) {
    if (!stampData) return;

    const stamp = {
      x: x,
      y: y,
      size: stampData.size,
      data: stampData.data,
    };
    this.stamps.push(stamp);
  }

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
    }
  }

  redrawStamps(p) {
    for (let stamp of this.stamps) {
      p.image(
        stamp.data,
        stamp.x - stamp.size / 2,
        stamp.y - stamp.size / 2,
        stamp.size,
        stamp.size
      );
    }
  }
}
*/
