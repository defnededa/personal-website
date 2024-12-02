function sketcher(ref) {
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
  };

  new p5(window[functionName], ref);
}
