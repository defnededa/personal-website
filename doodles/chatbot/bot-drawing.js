/* globals Vue, systems, Vector2D, tracery */

(function () {
  let bot = {
    /*
     * A bot that can listen, think and speak
     */

    // Start with no messages
    messages: [],

    //=========================================================================================
    // TODO: custom data

    hide: false,
    name: "drawingbot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a bot that draws with you",
    chatControlsHeight: 100, // How big do your controls need to be?

    // custom display names if you want
    userDisplayName: "🧑‍🎨",
    botDisplayName: "🤖",

    // Make your own grammar for this bot, use GPT to help, or watch a tutorial!
    grammar: new tracery.Grammar({
      // Yep, I got this from ChatGPT :-)
      // You should try writing your own, though!

      two_things: [
        "#color# and #light#",
        "#shadow# and #texture#",
        "#color# and #shapes#",
        "#light# and #shadow#",
        "#texture# and #surface#",
      ],
      stuff: ["#two_things#", "#thing#", "#adj# #thing#"],
      metaphor: [
        "dream",
        "imagination",
        "feeling",
        "story",
        "fantasy",
        "adventure",
        "wonder",
        "mystery",
        "journey",
      ],

      bots_turn: [
        "This needs more #stuff#",
        "I think I'll #do_stuff#",
        "Time to #do_stuff#",
      ],

      appreciate_human: [
        "#adj.capitalize#, but still #adj#",
        "#adj.capitalize#!",
        "#adj.a.capitalize# #stuff#",
        "The #stuff# is really #adj# now",
      ],

      description: [
        "#color# colors",
        "#shapes# and #forms#",
        "#texture# and #surface#",
        "#light# and #shadow#",
        "an interplay of #color# and #shapes#",
        "a fusion of #texture# and #light#",
      ],

      verb: [
        "paint",
        "create",
        "craft",
        "design",
        "compose",
        "conjure",
        "fashion",
        "forge",
        "sculpt",
        "shape",
        "inspire",
        "convey",
        "express",
        "capture",
        "evoke",
        "ignite",
        "enchant",
        "transform",
        "enrich",
        "animate",
        "weave",
        "meld",
        "blend",
        "reinterpret",
        "infuse",
      ],

      color: [
        "vivid",
        "neon",
        "chromatic",
        "eclectic",
        "hypnotic",
        "enigmatic",
        "sublime",
        "radiant",
        "whimsical",
        "psychedelic",
      ],
      light: [
        "shimmering",
        "luminous",
        "otherworldly",
        "radiant",
        "bewitching",
        "ethereal",
        "mesmerizing",
        "captivating",
        "spellbinding",
        "enchanting",
      ],
      shadow: [
        "enigmatic",
        "twisted",
        "mind-boggling",
        "bewildering",
        "surreal",
        "intriguing",
        "fascinating",
        "hypnotic",
        "mysterious",
        "dreamlike",
      ],
      shape: [
        "whimsical",
        "quirky",
        "dynamic",
        "eccentric",
        "fantastic",
        "playful",
        "surreal",
        "mesmerizing",
        "captivating",
        "mind-bending",
      ],
      texture: [
        "tactile",
        "visceral",
        "sensational",
        "mind-boggling",
        "unforgettable",
        "immersive",
        "intricate",
        "sensory",
        "ecstatic",
        "captivating",
      ],
      surface: [
        "canvas",
        "paper",
        "medium",
        "fabric",
        "substrate",
        "world",
        "dimension",
        "reality",
        "tapestry",
        "universe",
      ],
      forms: [
        "narrative",
        "adventure",
        "drama",
        "dream",
        "journey",
        "experience",
        "fantasy",
        "music",
        "jazz",
      ],

      adj: ["#color#", "#light#", "#shadow#", "#shape#", "#texture#"],
      thing: ["#surface#", "#surface#"],
      do_stuff: [
        "#verb# more #thing#",
        "#adj# up the #thing# a bit",
        "[myVerb:#verb#]#myVerb#, but #myVerb# in #adj.a# way",
      ],
    }),

    // For the drawing bot, we each get a color
    // What kind of data does your bot need?
    userColor: [320, 100, 50],
    botColor: [160, 100, 50],

    //=========================================================================================
    // events

    setup() {
      // TODO: does this bot need any setup?
      // Should it say something when it starts?

      // Setup this bot
      this.messages.push({
        text: "Let's draw together! 🖌️",
        from: "bot",
      });

      // Make fake messages to test it your grammar quickly
      // You can see here how to add a message to the message board
      // for (var i = 0; i < 10; i++) {
      // 	let text = this.grammar.flatten("#bots_turn#")
      // 	console.log(text)
      //   let msg = {
      //     text,
      //     from: "bot"
      //   }
      //   this.messages.push(msg)
      // }
    },

    // If you need more input data, add it here, and pass it in
    input({ text, from, otherDataHere }) {
      /**
       * TODO: what happens when we get some input from the user?
       * Consider "listen" "think" "speak"
       * How long should the bot wait to respond?
       * Maybe it can say some things fast, but needs more time for other things
       **/

      //==============================================
      // LISTEN - What did the human do?

      // Add the human's message to our message list
      this.messages.push({
        text,
        from,
      });

      console.log(`the bot got some input from the user: '${text}'`);

      // The user draws right away
      let p = this.p;
      p.fill(...this.userColor);
      p.circle(Math.random() * p.width, Math.random() * p.height, 30);

      //==============================================
      // THINK - What should the bot do now?
      //  this is a good time to pretend that you (the bot) are thinking deeply
      //  - even if you are faking it -- artificial intelligence is theater
      // Maybe you need a call to HuggingFace to decide what to do?

      let appreciationText = this.grammar.flatten("#appreciate_human#");
      let timeForBotToAppreciate = 1000;
      setTimeout(() => {
        this.messages.push({
          text: appreciationText,
          from: "bot",
        });
      }, timeForBotToAppreciate);

      //==============================================
      // SPEAK - What should the bot do now?
      //  this is a good time to pretend that you (the bot) are thinking deeply
      //  - even if you are faking it -- artificial intelligence is theater

      // Think a bit longer, then post a message
      let timeForBotToSpeak = timeForBotToAppreciate + 1000;
      setTimeout(() => {
        let botText = this.grammar.flatten("#bots_turn#");

        // Need more control? You can add HTML to your messages too
        // 	let color = this.botColor
        // 	let inlineStyle = `
        // 		background-color: hsl(${color[0]}, ${color[1]}%, ${color[2]}%);
        // 		width: 20px;
        // 		height: 20px;
        // 		border-radius: 10px;
        // 		display:inline-block;
        // 	`
        // botText = botText + `<div style=${inlineStyle} />`
        this.messages.push({
          text: botText,
          from: "bot",
        });
      }, timeForBotToSpeak);

      // Think a bit, then draw
      let timeForBotToDraw = timeForBotToSpeak + 1000;
      setTimeout(() => {
        // the bot draws something
        p.fill(...this.botColor);
        p.circle(Math.random() * p.width, Math.random() * p.height, 30);
      }, timeForBotToSpeak);
    },
  };

  //============================================================
  /**
   * TODO: A panel to the right of the chat
   * Could be for p5, drawing, displaying images, a game board, etc,
   * or leave it blank
   **/

  const WIDTH = 600;
  const HEIGHT = 400;

  Vue.component(`panel-${bot.name}`, {
    template: `<div ref="p5"></div>`,

    mounted() {
      // CREATE A PROCESSING INSTANCE IN THE PANEL
      new p5((p) => {
        // We have a new "p" object representing the sketch

        // Save p to the bot
        this.bot.p = p;

        p.setup = () => {
          p.createCanvas(WIDTH, HEIGHT);
          p.colorMode(p.HSL);
          p.ellipseMode(p.RADIUS);
        };

        p.mouseReleased = () => {
          console.log("Click");
          this.bot.input({ text: this.inputText, from: "user" });
        };

        p.draw = () => {};
      }, this.$refs.p5);
    },

    props: { bot: { required: true, type: Object } }, // We need to have bot
  });

  //============================================================
  /**
   * Input controls for this bot.
   * Do we just need a chat input? Do we need anything else?
   * What about game controls, useful buttons, sliders?
   **/

  Vue.component(`input-${bot.name}`, {
    // Custom inputs for this bot
    template: `<div>
			<!-- Basic chat control, press enter or the button to input -->
			<input @keyup.enter="sendText" v-model="inputText" />
			<button @click="sendText">send</button>

			<div>
				bot color:<color-picker v-model="bot.botColor" />
				human color:<color-picker v-model="bot.userColor" />
			</div>
		</div>`,

    methods: {
      sendText() {
        // Send the current text to the bot
        this.bot.input({ text: this.inputText, from: "user" });
        // Then clear it
        this.inputText = "";
      },
    },

    // Custom data for these controls
    data() {
      return {
        inputText: "",
      };
    },
    props: { bot: { required: true, type: Object } }, // We need to have bot
  });

  bots.push(bot);
})();
