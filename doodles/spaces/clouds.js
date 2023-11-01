(function () {
  let space = {
    /*
     * A latent space is a way of turning n-dimensional points into art
     */

    // TODO: Make your own dimensions
    dimensions: [
      "cloudcolor",
      "height",
      "width",
      "happiness",
      "eyecolor",
      "mouthcolor",
    ],
    hide: false,
    name: "clouds", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "clouds",

    landmarks: [
      {
        name: "small cloud",
        dna: [0.0, 0.0, 0.0, 0.0, 0.0, 0.02],
      },
      {
        name: "big cloud",
        dna: [0.32, 1.0, 1.0, 0.2, 0.42, 1.0],
      },
      {
        name: "crazy cloud",
        dna: [1.0, 1.0, 0.0, 1.0, 1.0, 0.0],
      },
      {
        name: "crazier cloud",
        dna: [0.0, 0.0, 1.0, 1.0, 1.0, 0.0],
      },
      {
        name: "calm cloud",
        dna: [1.0, 0.5, 0.5, 0.32, 0.0, 1.0],
      },
    ],

    //==================================================================
    // POPULATION  AS A WHOLE

    setup({ p, individuals, deltaTime, time }) {
      // Create initial population
    },

    draw({ p, individuals, deltaTime, time }) {
      p.background("#04C5FF");
      p.fill("#FFFA55");
      p.circle(0, 0, 200);
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
      let cloudcolor_R = p.map(dim.cloudcolor, 0, 1, 220, 255);
      let cloudcolor_G = p.map(dim.cloudcolor, 0, 1, 220, 255);
      let cloudcolor_B = p.map(dim.cloudcolor, 0, 1, 220, 255);

      let cloudcolor = p.color(cloudcolor_R, cloudcolor_G, cloudcolor_B);

      let height = p.map(dim.height, 0, 1, 10, 50);
      let width = p.map(dim.width, 0, 1, 50, 100);

      let eyecolor_R = p.map(dim.eyecolor, 0, 1, 0, 20);
      let eyecolor_G = p.map(dim.eyecolor, 0, 1, 0, 170);
      let eyecolor_B = p.map(dim.eyecolor, 0, 1, 0, 220);

      let eyecolor = p.color(eyecolor_R, eyecolor_G, eyecolor_B);

      let mouthcolor_R = p.map(dim.mouthcolor, 0, 1, 250, 255);
      let mouthcolor_G = p.map(dim.mouthcolor, 0, 1, 90, 200);
      let mouthcolor_B = p.map(dim.mouthcolor, 0, 1, 55, 180);

      let mouthcolor = p.color(mouthcolor_R, mouthcolor_G, mouthcolor_B);

      let happiness = p.map(dim.happiness, 0, 1, 0, 80);

      p.fill(cloudcolor);
      p.noStroke();

      // Draw cloud body
      for (let i = 0; i < 3; i++) {
        let cloudRadius = width / 3;
        p.ellipse(i * cloudRadius - cloudRadius / 2, 0, cloudRadius, height);
      }

      // Draw face
      let faceSize = height;
      let faceX = 0;
      let faceY = 0;

      p.fill(eyecolor);
      p.ellipse(faceX - faceSize / 4, faceY, faceSize / 8, faceSize / 8); // Left eye
      p.ellipse(faceX + faceSize / 4, faceY, faceSize / 8, faceSize / 8); // Right eye

      p.fill(mouthcolor);
      p.arc(faceX, faceY + faceSize / 4, faceSize / 3, happiness / 4, 0, p.PI); // Mouth

      p.pop();
    },
  };

  latentSpaces.push(space);
})();
