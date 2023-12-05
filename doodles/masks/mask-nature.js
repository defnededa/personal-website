/* globals Vue, p5, masks, CONTOURS, Vector2D */
(function () {
  let mask = {
    //=========================================================================================
    // TODO: custom data

    hide: false,
    name: "naturemask", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a mask that is nature themed",

    handSize: 1,
    backgroundHue: 104,
    backgroundSaturation: 81,

    // What kind of data does your bot need?

    //=========================================================================================

    setup({ p }) {
      // Runs when you start this mask
      console.log("START MASK - ", this.name);
    },

    drawBackground({ p }) {
      console.log(this.backgroundTransparency);
      p.background(this.backgroundHue, this.backgroundSaturation, 84, 2);
    },

    setupHand({ p, hand }) {},

    setupFace({ p, face }) {},

    drawHand({ p, hand }) {
      let t = p.millis() * 0.001;

      hand.landmarks.forEach((pt, index) => {
        let size = 40 * p.noise(index + t) * this.handSize;

        p.stroke(104, 72, 21);
        p.fill(91, 91, 53);

        p.ellipse(...pt, size, size * 2);
        p.fill(104, 72, 21);
        p.ellipse(...pt, size, size);
        p.textSize(size);
        p.text("🌿", ...pt);
      });
    },

    drawFace({ p, face }) {
      let t = p.millis() * 0.001;

      // Do something for each side
      face.forEachSide((SIDE_CONTOURS, sideIndex) => {
        p.fill(104, 72, 21);
        face.drawContour({
          p,
          contour: SIDE_CONTOURS.faceRings[sideIndex],
          contour1: SIDE_CONTOURS.faceRings[sideIndex],
        });
      });

      p.stroke(104, 72, 21);
      p.fill(91, 91, 53);
      p.textSize(24);
      p.circle(...face.nose, 20);
      p.text("🌿", ...face.nose);
      p.circle(...face.forehead, 20);
      p.text("🌿🌿🌿🌿", ...face.forehead);
      p.circle(...face.chin, 20);
      p.text("🌿", ...face.chin);
      p.circle(...face.ears[0], 20);
      p.text("🍃 ", ...face.ears[0], 20);
      p.circle(...face.ears[1], 20);
      p.text("🍃 ", ...face.ears[1], 20);
      p.circle(...face.eyes[0], 20);
      p.text("🍀", ...face.eyes[0], 20);
      p.circle(...face.eyes[1], 20);
      p.text("🍀", ...face.eyes[1], 20);

      p.strokeWeight(2);

      face.forEachSide((SIDE_CONTOURS, sideIndex) => {
        p.fill(120, 24, 46, 0.3);

        let innerEye = face.landmarks[SIDE_CONTOURS.eyeRings[4][0]];

        // Use every other point in this contour so it's smoother
        let butterflyContour = SIDE_CONTOURS.eyeRings[0].filter(
          (item, index) => index % 2 == 0
        );

        for (var i = 0; i < 5; i++) {
          face.drawContour({
            p,
            // the finalPoint gets moved into position
            transformPoint: (finalPoint, basePoint, index) => {
              finalPoint.setToLerp(
                basePoint,
                innerEye,
                3 + -0.3 * Math.sin(index * 3 + (3 + i) * t)
              );
            },
            useCurveVertices: false,
            contour: butterflyContour,
          });
        }
      });

      // Draw basic eye contours for the innermost eye

      p.stroke(0);
      face.drawContour({
        p,
        contour: CONTOURS.sides[0].eyeRings[4],
        useCurveVertices: true,
      });

      p.stroke(0);
      face.drawContour({
        p,
        contour: CONTOURS.sides[1].eyeRings[4],
        useCurveVertices: true,
      });

      // DRAW EACH EYE
      face.eyes.forEach((eyePt) => {
        p.fill(91, 34, 28);
        p.circle(...eyePt, 20);

        p.fill(355, 34, 28);
        p.circle(eyePt.x, eyePt.y - 5, 10);
      });
    },
  };

  //============================================================
  /*
   * Input controls for this bot.
   */

  Vue.component(`input-${mask.name}`, {
    // Custom inputs for this bot
    template: `<div>
                <div> Hand Size: <input type="range" v-model ="mask.handSize"  min="0.1" max="4" step=".1" />{{mask.handSize}}</div>
                <div> Background Hue: <input type="range" v-model ="mask.backgroundHue"  min="0" max="360" step=".1" />{{mask.backgroundHue}}</div>
                <div> Background Saturation: <input type="range" v-model ="mask.backgroundSaturation"  min="0" max="100" step=".1" />{{mask.backgroundSaturation}}</div>
              </div>
              
      
			
		</div>
          </div>`,

    // Custom data for these controls
    data() {
      return {};
    },
    props: { mask: { required: true, type: Object } }, // We need to have bot
  });

  masks.push(mask);
})();
