(function () {
  let space = {
    /*
     * A latent space is a way of turning n-dimensional points into art
     */

    // TODO: Make your own dimensions
    dimensions: [
      "strawberrycolor",
      "height",
      "width",
      "stemcolor",
      "seedcolor",
      "seedcount",
    ],
    hide: false,
    name: "strawberryfield", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "some strawberries",

    landmarks: [
      {
        name: "small strawberry",
        dna: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02],
      },
      {
        name: "big strawberry",
        dna: [0.32, 1.0, 1.0, 0.2, 0.0, 1.0],
      },
      {
        name: "pineberry",
        dna: [1.0, 0.46, 0.26, 0.83, 0.0, 0.32],
      },
      {
        name: "simpleberry",
        dna: [0.0, 0.26, 0.26, 0.0, 0.0, 0.0],
      },
      {
        name: "activeberry",
        dna: [0.09, 0.07, 0.02, 0.77, 1.0, 1.0],
      },
    ],

    //==================================================================
    // POPULATION  AS A WHOLE

    setup({ p, individuals, deltaTime, time }) {
      // Create initial population
    },

    draw({ p, individuals, deltaTime, time }) {
      p.background("#dffad7");
      p.fill("#48E9FA");
      p.stroke("#363636");
      p.rect(-5, -5, 1000, 200);
    },

    //==================================================================
    // INDIVIDUAL

    setupIndividual(individual, { p }) {
      // Setup an individual,
      // if you need to initialize any variables for an individual
      // Note that their DNA may change after this, so only use it for non-DNA stuff

      // e.g, give each rectangle a position we can move around later (good for particles)
      // individual.position = new Vector2D()
      individual.position = new Vector2D(0, 50);
    },

    updateIndividual(individual, { p, time, deltaTime }) {},

    drawIndividual(individual, { p, time, deltaTime }) {
      let dim = {};
      this.dimensions.forEach((dimName, index) => {
        dim[dimName] = individual.dna[index];
      });

      let yOffset = -10;
      let xOffset = 0;

      p.push();

      const [x, y] = individual.basePosition;

      p.translate(x + xOffset, y + yOffset);

      p.scale(individual.baseScale);

      let strawberrycolor_R = p.map(dim.strawberrycolor, 0, 1, 235, 255);
      let strawberrycolor_B = p.map(dim.strawberrycolor, 0, 1, 77, 225);
      let strawberrycolor_G = p.map(dim.strawberrycolor, 0, 1, 0, 215);

      let strawberrycolor = p.color(
        strawberrycolor_R,
        strawberrycolor_G,
        strawberrycolor_B
      );

      let stemcolor_R = p.map(dim.stemcolor, 0, 1, 60, 175);
      let stemcolor_G = p.map(dim.stemcolor, 0, 1, 150, 255);
      let stemcolor_B = p.map(dim.stemcolor, 0, 1, 0, 120);

      let stemcolor = p.color(stemcolor_R, stemcolor_G, stemcolor_B);

      let height = p.map(dim.height, 0, 1, 50, 150);
      let width = p.map(dim.width, 0, 1, 60, 80);

      let seedcolor_R = p.map(dim.seedcolor, 0, 1, 210, 255);
      let seedcolor_G = p.map(dim.seedcolor, 0, 1, 210, 255);
      let seedcolor_B = p.map(dim.seedcolor, 0, 1, 0, 255);

      let seedcolor = p.color(seedcolor_R, seedcolor_G, seedcolor_B);

      let seedcount = p.map(dim.seedcount, 0, 1, 0, 10);

      p.fill(strawberrycolor);
      p.stroke("#363636");

      p.beginShape();
      p.vertex(0, 0);
      p.bezierVertex(-width / 2, -height / 2, -width, height / 3, 0, height);
      p.bezierVertex(width, height / 3, width / 2, -height / 2, 0, 0);
      p.endShape();

      p.fill(seedcolor);
      for (let i = 0; i < seedcount; i++) {
        let seedX = p.random(-width / 2.5, width / 2.5);
        let seedY = height / 3 + p.random(-height / 4, height / 4);
        p.ellipse(seedX, seedY, width / 10, height / 15);
      }

      p.fill(stemcolor);
      p.rect(-width / 20, -height / 2, width / 10, height / 3);

      p.arc(-width / 4, -height / 8, width / 3, height / 3, -p.PI, 0);
      p.arc(width / 4, -height / 8, width / 3, height / 3, -p.PI, 0);
      p.circle(0, -height / 5, width / 4);

      p.pop();
    },
  };

  latentSpaces.push(space);
})();
