Vue.component("essay-crayola", {
  template: `	
    <article>
      
  
      <!-- Interactive color grouping -->
      <section>
      <p>This interactive tool sorts Crayola colors into groups like <b>Red, Orange, Yellow, Green, Blue, Purple,</b> and <b>Black</b>. The sorting uses math to measure how close each color is to a basic color in the group. The closest color match decides the group for each crayon.</p>
      </section>
      <section>
      <p>But, this math method doesn’t always match how people see colors. Our eyes can see about <b>10 million colors!</b> This is because of special cells in our eyes that are sensitive to <b>Red, Green,</b> and <b>Blue light</b>. Our eyes are most sensitive to <b>green light</b>, which can make us see some colors differently.</p>
      </section>
      <section>
      <p>For example, a color like <b>"Inchworm,"</b> which is close to yellow in math, might look green to us. This shows how tricky it can be to match math with human color perception.</p>
      </section>
      <button v-for="group in colorGroups" :key="group" @click="selectedGroup = group">
        {{ group }}
      </button>
    </section>

    <section v-if="selectedGroup">
      <h2>{{ selectedGroup }} Colors</h2>
      <p>Total: {{ groupedColors[selectedGroup].length }}</p>
      <div class="color-display-container">
        <div v-for="color in groupedColors[selectedGroup]" :key="color.color" class="color-display" :style="{ backgroundColor: color.hex }">
          {{ color.color }}
        </div>
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
