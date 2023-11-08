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
    name: "gossipbot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a bot that draws with you",
    chatControlsHeight: 100, // How big do your controls need to be?

    // custom display names if you want
    userDisplayName: "💅",
    botDisplayName: "💁‍♀️",

    grammar: new tracery.Grammar({
      celebrity: [
        "Britney Spears",
        "Lindsay Lohan",
        "Paris Hilton",
        "Justin Timberlake",
        "Christina Aguilera",
        "Katy Perry",
        "Taylor Swift",
        "Harry Styles",
        "Justin Bieber",
        "Avril Lavigne",
        "Carly Rae Japsen",
        "Kim Kardashian",
        "Selena Gomez",
        "Demi Lovato",
        "Miley Cyrus",
        "Joe Jonas",
        "Nick Jonas",
        "Nicki Minaj",
        "Niall Horan",
      ],
      action: [
        "was spotted",
        "is rumored to be",
        "tweeted something controversial about",
        "is at war with",
        "just announced a shocking",
        "was seen",
        "got in a fight with",
        "kissed",
        "is in love with",
      ],
      place: [
        "in the Hollywood Hills",
        "at an exclusive underground club",
        "in a Twitter post",
        "in downtown LA",
        "at the New York Fashion Week",
      ],
      thing: [
        "a new album drop",
        "unexpected cameo",
        "a major wardrobe malfunction",
        "a secret relationship",
        "a tell-all interview",
        "an appeareance on Disney channel",
        "a concert",
      ],
      adj: [
        "shocking",
        "hilarious",
        "bizarre",
        "exciting",
        "scandalous",
        "insane",
        "hot",
        "ground-breaking",
        "rad",
      ],

      gossip: [
        "Did you hear? #celebrity# #action# #place#!",
        "Apparently, #celebrity# #action# #thing#. It’s so #adj#!",
        "I can’t believe what I just heard! #celebrity# #action# #place# and it was #adj#!",
        "Will #celebrity# survive their latest #thing#? Guess we will find out, xoxo!",
      ],

      scandal: [
        "Here is a scandal for you: #celebrity# lost it #place#! Everyone is talking about it, even #celebrity# .",
        "Scandal! Apparently #celebrity# have been cheating on their partner! How #adj#!",
      ],

      happynews: [
        "The word happy reminds me... You won't believe it! #celebrity# is getting married to #celebrity#!",
        "The word happy reminds me... It is #celebrity#'s birthday! We wish them a happy birthday. How #adj#!",
      ],

      latest: [
        "Just in: #celebrity# #action# #celebrity#!",
        "Latest: #celebrity# just had #thing# that is #adj#!",
      ],

      origin: ["#gossip#"],
    }),

    // For the drawing bot, we each get a color
    // What kind of data does your bot need?
    userColor: [320, 100, 50],
    botColor: [160, 100, 50],

    //=========================================================================================
    // events

    setup() {
      this.messages.push({
        text: "Let's (fake) gossip! You can ask me for a scandal, happy or latest news! I can also give you other general gossip.",
        from: "bot",
      });
    },

    // If you need more input data, add it here, and pass it in
    input({ text, from, otherDataHere }) {
      this.messages.push({
        text,
        from,
      });

      console.log(`the bot got some input from the user: '${text}'`);

      let timeForBotToRespond = 1000;
      setTimeout(() => {
        let responseKey; // This will determine which grammar to use based on the keyword
        // Check the input text for specific keywords and set the response key accordingly
        if (text.toLowerCase().includes("scandal")) {
          responseKey = "scandal";
        } else if (text.toLowerCase().includes("happy")) {
          responseKey = "happynews";
        } else if (text.toLowerCase().includes("late")) {
          responseKey = "latest";
        } else {
          responseKey = "origin"; // Default response if no keyword is detected
        }

        let gossipMessage = this.grammar.flatten(`#${responseKey}#`);
        this.messages.push({
          text: gossipMessage,
          from: "bot",
        });
      }, timeForBotToRespond);
    },
  };

  Vue.component(`panel-${bot.name}`, {
    template: `<div ref="p5"></div>`,
  });

  Vue.component(`input-${bot.name}`, {
    // Custom inputs for this bot
    template: `
    <div class="input-fortunebot">
      <!-- Basic chat control, press enter or the button to input -->
      <input 
        @keyup.enter="sendText" 
        v-model="inputText" 
        placeholder="'gossip'" 
      />
      <button @click="sendText">Gossip</button>
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
