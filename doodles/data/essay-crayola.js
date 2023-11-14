Vue.component("essay-crayola", {
  template: `	
  <article>
    <!-- title section -->      
    <section>
      <h1>Looking into Crayola Colors</h1>
    </section>
    <section>
    <p>Here is a list of Crayola crayon standard colors in the 120-count box. </p>
    </section>
    <section>
    <p>In their website, Crayola claims that the process of selecting names for crayon colors is both a science and an art. Most of their color names are sourced from a book titled "Color: Universal Language and Dictionary of Names," published by the U.S. Bureau of Standards. This reference is crucial because it acknowledges that everyone perceives and expresses color differently. By using the Universal dictionary as a foundation, Crayola ensures a consistent standard for color systems and names. Beyond this, many crayon names are inspired by traditional artists' paints, adding a touch of historical and artistic significance to their palette. Interestingly, Crayola also engages with their consumers for naming new colors, through various promotions, allowing the public to contribute to the colorful world of Crayola crayons. This blend of scientific approach, artistic inspiration, and community involvement makes the naming of Crayola crayons a unique and inclusive process.</p>
    </section>
    <section>
    <a href="https://www.crayola.com/faq/another-topic/how-do-you-select-the-names-of-the-crayon-colors/">For more details, visit their website here.</a> 
    </section>
    
    <!-- Display all colors -->
    <section>
      <div v-for="color in crayola.colors" :key="color.color" class="color-display" :style="{ backgroundColor: color.hex }">
        {{ color.color }}
      </div>
    </section>

    <!-- Interactive color grouping -->
    <section>
    <p>In this interactive tool, I tried to categorize Crayola colors into predefined groups such as Red, Orange, Yellow, Green, Blue, Purple and Black. This categorization is based on a mathematical approach that calculates the 3D distance between the RGB values of each Crayola color and a set of basic color RGB values representing each group. The color is then assigned to the group to which it is closest in terms of this RGB distance.</p>
    </section>
    <section>
    <p>However, this method, while mathematically sound, doesn't always align with human color perception. The human eye is a sophisticated organ, capable of differentiating between approximately 10 million colors. This remarkable ability is due to the retina's rod and cone cells, with the cones being sensitive to Red, Green, and Blue light. Interestingly, the eye's sensitivity peaks at a wavelength of 555 nanometers, which corresponds to the color green. This heightened sensitivity to green means that our perception of colors can be skewed, especially in the green-yellow range.
    </p> </section>
    <section>
    <p>As a result, colors like "Inchworm," which are mathematically closer to yellow, might be perceived as green by the human eye. This discrepancy highlights the subjective nature of color perception and the challenges in creating a color categorization system that perfectly matches human perception. This tool, therefore, serves as an interesting exploration into the intersection of mathematical categorization and human visual experience, illustrating that while we can attempt to quantify and categorize colors, our perception of them can vary significantly.
    </p> </section>
    <section>
    <a href="https://www.nde-ed.org/NDETechniques/PenetrantTest/Introduction/lightresponse.xhtml">For more details, check this research out.</a> 
    </section>

    
      <button v-for="group in colorGroups" :key="group" @click="selectedGroup = group">
        {{ group }}
      </button>

      <div v-if="selectedGroup">
        <h2>{{ selectedGroup }} Colors</h2>
        <p>Total: {{ groupedColors[selectedGroup].length }}</p>
        <div v-for="color in groupedColors[selectedGroup]" :key="color.color" class="color-display" :style="{ backgroundColor: color.hex }">
          {{ color.color }}
        </div>
      </div>
    </section>

    <!-- Interactive color search -->
    <section>
    <p>As a way to finish this experience off, let’s do a memorization challenge! Test your knowledge and memory skills by recalling the names of various Crayola colors. If you correctly remember and input the name of a color, the game will reward you by changing the background to that specific shade. This not only makes the experience visually stimulating but also reinforces your color recognition and memory. It's a fun and educational way to see how well you know the Crayola color spectrum. Are you ready to put your color knowledge to the test and see the world in a vibrant new way?
    </p>
    </section>
    <section>
      <input v-model="searchColor" placeholder="Type a color name...">
      <div class="color-display" :style="{ backgroundColor: findColorHex(searchColor) }">
        {{ searchColor }}
      </div>
    </section>
  
  </article>
  `,

  data() {
    return {
      crayola: { colors: [] },
      searchColor: "",
      selectedGroup: "",
      colorGroups: [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple",
        "Black",
      ],
    };
  },
  computed: {
    groupedColors() {
      let groups = {
        Red: [],
        Orange: [],
        Yellow: [],
        Green: [],
        Blue: [],
        Purple: [],
        Black: [],
      };
      this.crayola.colors.forEach((color) => {
        let group = this.determineColorGroup(color.hex);
        groups[group].push(color);
      });
      return groups;
    },
  },

  methods: {
    distance3d(rgb1, rgb2) {
      return Math.sqrt(
        Math.pow(rgb1[0] - rgb2[0], 2) +
          Math.pow(rgb1[1] - rgb2[1], 2) +
          Math.pow(rgb1[2] - rgb2[2], 2)
      );
    },

    determineColorGroup(hex) {
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      let rgb = [r, g, b];

      let basicColors = {
        Red: [255, 0, 0],
        Orange: [255, 128, 0],
        Yellow: [255, 255, 0],
        Green: [0, 255, 0],
        Blue: [0, 0, 255],
        Purple: [128, 0, 128],
        Black: [0, 0, 0],
      };

      let closestColor = "Other";
      let minDistance = Infinity;

      for (let color in basicColors) {
        let distance = this.distance3d(rgb, basicColors[color]);
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = color;
        }
      }

      return closestColor;
    },

    findColorHex(colorName) {
      const color = this.crayola.colors.find(
        (c) => c.color.toLowerCase() === colorName.toLowerCase()
      );
      return color ? color.hex : "transparent";
    },
  },

  mounted() {
    var crayolaURL = "data/crayola.json";
    fetch(crayolaURL)
      .then((response) => response.json())
      .then((data) => {
        this.crayola = data;
      })
      .catch((error) => {
        console.error("Error loading JSON data:", error);
      });
  },
});
