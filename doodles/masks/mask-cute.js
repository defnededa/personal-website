(function () {
  function drawInNeonColors({ p, color, width, fxn }) {
    // Handy function to draw neon!
    p.noFill();
    p.strokeWeight(width * 2);
    p.stroke(color[0], color[1], color[2], 0.3);
    fxn();

    p.strokeWeight(width);
    p.stroke(color[0], color[1], color[2] + 10, 0.3);
    fxn();

    p.strokeWeight(width * 0.6);
    p.stroke(color[0], color[1], color[2] + 30, 1);
    fxn();
    p.strokeWeight(1);
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

  let mask = {
    //=========================================================================================
    // TODO: custom data

    hide: false,
    name: "cutemask", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a cute mask",
    backgroundLight: 36,
    brushSize: 20,
    centerWidth: 1,
    emojiList: 0.5,

    //=========================================================================================
    setup({ p }) {
      console.log("START MASK - ", this.name);
    },

    drawBackground({ p }) {
      p.background(305, 100, this.backgroundLight, 0.3);
    },

    setupHand({ p, hand }) {
      // Any data that you need on each hand
    },

    setupFace({ p, face }) {
      // Any data that you need on each face
    },

    drawHand({ p, hand }) {
      let t = p.millis() * 0.001;

      CONTOURS.fingers.forEach((finger) => {
        drawInNeonColors({
          p,
          color: [328, 86, 86],
          width: 35,
          fxn: () => {
            hand.drawContour({
              p,
              contour: finger,
            });
          },
        });
      });

      hand.landmarks.forEach((pt, index) => {
        p.fill(100);

        let pinks = ["💓", "💞", "💝", "💖", "🎀", "🌺", "🌸", "🐷", "👛"];
        let purples = ["💜", "🍇", "🔮", "👾", "🦄", "🍆"];
        let blues = ["🎐", "🫧", "🦋", "🧿", "💠", "🌀", "💎", "⛲", "🪞"];
        p.textSize(20);
        if (this.emojiList < 1) {
          let emoji = p.random(pinks);
          p.text(emoji, ...pt);
        } else if (this.emojiList < 2) {
          let emoji = p.random(purples);
          p.text(emoji, ...pt);
        } else {
          let emoji = p.random(blues);
          p.text(emoji, ...pt);
        }
      });
    },

    drawFace({ p, face }) {
      let t = p.millis() * 0.001;
      let outlineCount = 75;
      for (var i = 0; i < outlineCount; i++) {
        let pct = (i / outlineCount + t) % 1;
        let opacity = 10 + 0.2 * Math.sin(pct * Math.PI);

        let faceContour = CONTOURS.sides[0].faceRings[0].concat(
          CONTOURS.sides[1].faceRings[0].slice().reverse()
        );

        p.noFill();
        p.stroke(280, 94, 82, opacity);
        face.drawContour({
          p,
          // the finalPoint gets moved into position
          transformPoint: (finalPoint, basePoint, index) => {
            finalPoint.setToLerp(
              face.center,
              basePoint,
              0.9 + pct + pct * p.noise(t + index * 0.9 + pct)
            );
          },
          useCurveVertices: false,
          contour: faceContour,
          close: true,
        });
      }

      face.forEachSide((sideContours, sideIndex) => {
        p.noStroke();

        p.fill(328, 94, 40 + sideIndex * 10);
        face.drawContour({
          p,
          contour: sideContours.faceRings[0],
          contour1: CONTOURS.centerLine,
        });

        p.noStroke();

        // // Draw multiple strips around the face
        for (var i = 0; i < 2; i++) {
          p.fill(270, 100, (i * 30 + 50 + 40 * t) % 100);
          face.drawContour({
            p,
            contour: sideContours.faceRings[i],
            contour1: sideContours.faceRings[i + 1],
          });
        }
      });

      // Draw the eye on either side
      face.forEachSide((sideContours, sideIndex) => {
        // Draw the eye lines
        sideContours.eyeRings.forEach((eyeRing, eyeIndex) => {
          drawInNeonColors({
            p,
            color: [328, 86, 86],
            width: 30,
            fxn: () => {
              face.drawContour({
                p,
                contour: eyeRing,
                close: true,
              });
            },
          });

          face.eyes.forEach((eyePt) => {
            p.fill(328, 94, 55);
            drawHeart(p, eyePt.x, eyePt.y - 5, 30);
          });
        });
      });

      // Draw the center line to the nose
      drawInNeonColors({
        p,
        color: [328, 86, 86],
        width: this.centerWidth,
        fxn: () => {
          face.drawContour({
            p,
            contour: CONTOURS.centerLine.slice(0, 100),
          });
        },
      });

      // Draw the center line to below the mouthe
      drawInNeonColors({
        p,
        color: [328, 86, 86],
        width: 1,
        fxn: () => {
          face.drawContour({
            p,
            contour: CONTOURS.centerLine.slice(10),
          });
        },
      });

      p.noFill();
      // Draw the mouth lines
      CONTOURS.mouth.slice(3).forEach((mouthLine, mouthIndex) => {
        // Neon style
        drawInNeonColors({
          p,
          color: [328, 86, 86],
          width: 1,
          fxn: () => {
            face.drawContour({
              p,
              contour: mouthLine.slice(0),
              close: true,
            });
          },
        });
      });
    },
  };

  //============================================================
  /**
   * Input controls for this bot.
   **/

  Vue.component(`input-${mask.name}`, {
    // Custom inputs for this bot
    template: `<div>
            
                <div>
                <div> Background Light: <input type="range" v-model ="mask.backgroundLight"  min="0" max="100" step=".1" />{{mask.backgroundLight}}</div>
                <div> Center Width: <input type="range" v-model ="mask.centerWidth"  min="0" max="20" step=".1" />{{mask.centerWidth}}</div>
                <div> Emoji pick: <input type="range" v-model ="mask.emojiList"  min="0" max="3" step=".1" />{{mask.emojiList}}</div>
                
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
