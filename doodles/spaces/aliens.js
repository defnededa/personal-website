(function () {
  let space = {
    /*
     * A latent space is a way of turning n-dimensional points into art
     */

    // TODO: Make your own dimensions
    dimensions: [
      "skincolor",
      "eyecolor",
      "haircolor",
      "size",
      "eyesize",
      "mouthcolor",
    ],
    hide: false,
    name: "aliens", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "alien heads",

    landmarks: [
      {
        name: "small alien",
        dna: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02],
      },
      {
        name: "big alien",
        dna: [0.81, 0.0, 1.0, 1.0, 1.0, 1.0],
      },
      {
        name: "father alien",
        dna: [1.0, 1.0, 0.0, 1.0, 1.0, 0.0],
      },
      {
        name: "mother alien",
        dna: [0.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      },
      {
        name: "granny alien",
        dna: [1.0, 0.5, 0.5, 0.32, 0.0, 1.0],
      },
    ],

    //==================================================================
    // POPULATION  AS A WHOLE

    setup({ p, individuals, deltaTime, time }) {
      // Create initial population
    },

    draw({ p, individuals, deltaTime, time }) {
      p.background("#050098");
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

      let skincolor_R = p.map(dim.skincolor, 0, 1, 50, 150);
      let skincolor_G = p.map(dim.skincolor, 0, 1, 180, 255);
      let skincolor_B = p.map(dim.skincolor, 0, 1, 50, 150);

      let skincolor = p.color(skincolor_R, skincolor_G, skincolor_B);

      let eyecolor_R = p.map(dim.eyecolor, 0, 1, 195, 220);
      let eyecolor_G = p.map(dim.eyecolor, 0, 1, 0, 90);
      let eyecolor_B = p.map(dim.eyecolor, 0, 1, 240, 255);

      let eyecolor = p.color(eyecolor_R, eyecolor_G, eyecolor_B);

      let haircolor_R = p.map(dim.haircolor, 0, 1, 200, 255);
      let haircolor_G = p.map(dim.haircolor, 0, 1, 100, 200);
      let haircolor_B = p.map(dim.haircolor, 0, 1, 0, 10);

      let haircolor = p.color(haircolor_R, haircolor_G, haircolor_B);

      let size = p.map(dim.size, 0, 1, 20, 50);

      let eyesize = p.map(dim.eyesize, 0, 1, 0.5, 1);

      let mouthcolor_R = p.map(dim.mouthcolor, 0, 1, 200, 255);
      let mouthcolor_G = p.map(dim.mouthcolor, 0, 1, 130, 190);
      let mouthcolor_B = p.map(dim.mouthcolor, 0, 1, 150, 255);

      let mouthcolor = p.color(mouthcolor_R, mouthcolor_G, mouthcolor_B);

      // Draw hair
      p.fill(haircolor);
      p.arc(0, -size / 200, size * 1.2, size * 2, p.PI, 0);

      // Draw alien body
      p.fill(skincolor);
      p.noStroke();
      p.ellipse(0, 0, size, size * 1.2);

      // Draw eyes
      p.fill(eyecolor);
      for (let i = -1; i < 2; i += 2) {
        p.ellipse(
          i * (size / 4),
          -(size / 4),
          (size / 4) * eyesize,
          (size / 6) * eyesize
        );
      }

      // Draw mouth
      p.fill(mouthcolor);
      p.arc(0, size / 6, size / 4, size / 8, 0, p.PI);

      p.pop();
    },
  };

  latentSpaces.push(space);
})();
