/* globals Vue, systems, Vector2D, tracery */

(function () {
  let bot = {
    messages: [],
    hide: false,
    name: "fortunebot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a bot who reads fortune",
    chatControlsHeight: 100, // How big do your controls need to be?

    // Make your own grammar for this bot, use GPT to help, or watch a tutorial!
    grammar: new tracery.Grammar({}),

    fortunes: {
      //hearts
      "ace of hearts": "I see new relationships, friendship.",
      "2 of hearts": "I see good fortune in love and relationships.",
      "3 of hearts": "Be cautious in your relationships...",
      "4 of hearts": "Change or travel is on the horizon",
      "5 of hearts": "Someone in your life is jealous.",
      "6 of hearts": "I see a surprise new love interest.",
      "7 of hearts": "I see broken promises.",
      "8 of hearts": "I see visitors and invitations",
      "9 of hearts": "This is the wish card—which may come true.",
      "10 of hearts": "Good fortune is coming.",
      "jack of hearts":
        "This card can represent a good friend or a young, blond person.",
      "queen of hearts": "I see a kind blond woman.",
      "king of hearts": "I see a helpful blond man, good advice",

      //spades
      "ace of spades": "I see endings and misfortune.",
      "2 of spades": "I see tough decisions, deceit, and change.",
      "3 of spades": "I see trouble in relationships, possibly infidelity.",
      "4 of spades": "I see illness and broken promises.",
      "5 of spades": "I see obstacles and difficulty, with eventual success.",
      "6 of spades": "I see improvement, small wins, and an upswing.",
      "7 of spades": "I see bad advice, grief, and loss.",
      "8 of spades": "I see deceit and danger; caution is advised.",
      "9 of spades": "I see bad luck, depression, and anxiety.",
      "10 of spades": "I see bad news, worry, and imprisonment.",
      "jack of spades":
        "I see an unpleasant or immature young person with black hair.",
      "queen of spades": "I see a dark-haired woman or a widow.",
      "king of spades": "I see a dark-haired selfish but ambitious older man.",

      //clubs
      "ace of clubs": "I see financial fortune, wealth, and good news.",
      "2 of clubs": "I see challenges and gossip.",
      "3 of clubs": "I see a wealthy partner and successful marriage.",
      "4 of clubs": "I see deceit or betrayal, potentially by a friend.",
      "5 of clubs": "I see new friends and support.",
      "6 of clubs": "I see success and prosperity, with financial help.",
      "7 of clubs":
        "I see success in business with potential trouble from a romantic partner.",
      "8 of clubs": "I see difficulty in business and in love.",
      "9 of clubs":
        "I see a new admirer or opportunities, with a warning against stubbornness.",
      "10 of clubs": "I see unexpected money and travel.",
      "jack of clubs": "I see a reliable and trusted dark-haired friend.",
      "queen of clubs": "I see a dark-haired, helpful, and confident woman.",
      "king of clubs": "I see a dark-haired, strong older man.",

      //diamonds
      "ace of diamonds":
        "I see a gift of jewelry, a letter, or message, indicating improvement.",
      "2 of diamonds": "I see disapproval of a relationship or affair.",
      "3 of diamonds": "I see legal trouble and domestic arguments.",
      "4 of diamonds": "I see unexpected money or an inheritance.",
      "5 of diamonds":
        "I see improvements and success in business, and a happy home life.",
      "6 of diamonds":
        "I see relationship troubles, problems in a second marriage.",
      "7 of diamonds": "I see challenges at work.",
      "8 of diamonds": "I see surprise romance or travel later in life.",
      "9 of diamonds": "I see new business opportunities and unexpected money.",
      "10 of diamonds": "I see financial prosperity and good fortune.",
      "jack of diamonds":
        "I see an unreliable or dishonest young person with light hair.",
      "queen of diamonds":
        "I see an outgoing, flirtatious woman with light hair.",
      "king of diamonds":
        "I see an accomplished older man of influence with light hair.",
    },

    setup() {
      console.log("Setup", this.name);
      // Bot introduction message
      this.messages.push({
        text: "Welcome to FortuneBot. Please pick a card from the deck (e.g., 'Ace of Hearts, 7 of Spades').",
        from: "Fortune-Teller",
      });
    },

    speak(message) {
      this.messages.push(message);
      this.playSound();
    },

    playSound() {
      let sound = document.getElementById("glitter-sound");
      if (sound) {
        sound.play();
      }
    },

    input({ text, from, otherDataHere }) {
      console.log(`the bot got some input from the user: '${text}'`);
      this.messages.push({
        text,
        from,
      });

      let card = text.trim().toLowerCase();
      let fortune = this.fortunes[card];

      let normalizedCard = card.replace(/\s+/g, "_");
      let cardImageExists = this.cardImageExists(normalizedCard);
      this.selectedCard = fortune && cardImageExists ? normalizedCard : null;

      //error message
      let responseText = fortune
        ? fortune
        : "I don't recognize that card. Please pick a card from the deck (e.g., 'Ace of Hearts'). Make sure to only type the name of the card, and keep numbers in number form.";

      let timeForBotToRespond = 1000;

      setTimeout(() => {
        this.speak({
          text: responseText + " Pick another card to continue.",
          from: "Fortune-Teller",
        });
      }, timeForBotToRespond);
    },

    cardImageExists(card) {
      // Check if the image exists in the "playingcards" directory
      let img = new Image();
      img.src = `playingcards/${card}.png`;
      return img.complete || img.height !== 0;
    },
  };
  Vue.component(`panel-${bot.name}`, {
    template: `
        <div class="panel-fortunebot">
        <div v-if="bot.selectedCard" class="card-display">
        <div class="card-text">You picked:</div>
        <img :src="'playingcards/' + bot.selectedCard + '.png'" alt="Card Image" class="card-image"/>
        </div>
        <div v-for="message in bot.messages" class="message" :class="{ 'from-bot': message.from === 'bot' }">
        </div>
        
         <audio id="glitter-sound" src="sounds/glittersound.mp3" preload="auto"></audio>
    </div>
    `,
    props: { bot: { required: true, type: Object } },
    filters: {
      capitalize: function (value) {
        if (!value) return "";
        value = value.toString();
        return value.replace(/(?:^|\s)\S/g, function (a) {
          return a.toUpperCase();
        });
      },
    },
  });

  Vue.component(`input-${bot.name}`, {
    template: `
      <div class="input-fortunebot">
        <!-- Basic chat control, press enter or the button to input -->
        <input 
          @keyup.enter="sendText" 
          v-model="inputText" 
          placeholder="'Ace of Hearts'" 
        />
        <button @click="sendText">Tell Fortune</button>
      </div>
    `,
    data() {
      return {
        inputText: "",
      };
    },
    methods: {
      sendText() {
        this.bot.input({ text: this.inputText, from: "user" });
        this.inputText = ""; // Clear the input after sending
      },
    },
    props: { bot: { required: true, type: Object } },
  });

  bots.push(bot);
})();
