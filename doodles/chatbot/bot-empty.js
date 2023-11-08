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
    name: "emptybot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a bot does nothing",
    chatControlsHeight: 100, // How big do your controls need to be?

    // Make your own grammar for this bot, use GPT to help, or watch a tutorial!
    grammar: new tracery.Grammar({}),

    // What kind of data does your bot need?
    // this bot can count so it needs a number
    number: 1,

    //=========================================================================================
    // events

    setup() {
      console.log("Setup", this.name);
      // TODO: does this bot need any setup?
      // Should it say something when it starts?

      // Setup this bot
      this.messages.push({
        text: "I don't listen, I just count",
        from: "bot",
      });

      // Count every 3 seconds
      setInterval(() => {
        this.countUp();
      }, 3000);
    },

    countUp() {
      // A custom method for this bot
      // The bot counts and says its new number
      this.number += 1;
      this.messages.push({
        text: "number is " + this.number,
        from: "bot",
      });
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
      console.log(`the bot got some input from the user: '${text}'`);
      this.messages.push({
        text,
        from,
      });

      //==============================================
      // THINK - What should the bot do now?
      //  this is a good time to pretend that you (the bot) are thinking deeply
      //  - even if you are faking it -- artificial intelligence is theater
      // Maybe you need a call to HuggingFace to decide what to do?

      let timeForBotToRespond = 1000;
      setTimeout(() => {
        this.messages.push({
          text: "...I don't care",
          from: "bot",
        });
      }, timeForBotToRespond);

      //==============================================
      // SPEAK - What should the bot do now?
      //  this is a good time to pretend that you (the bot) are thinking deeply
      //  - even if you are faking it -- artificial intelligence is theater

      // Think a bit longer, then post a message
      let timeForBotToSpeak = timeForBotToRespond + 1000;
      setTimeout(() => {
        this.countUp();
      }, timeForBotToSpeak);
    },
  };

  //============================================================
  /**
   * TODO: A panel to the right of the chat
   * Could be for p5, drawing, displaying images, a game board, etc,
   * or leave it blank
   **/

  Vue.component(`panel-${bot.name}`, {
    template: `<div>

			A big empty space

		</div>`,

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
