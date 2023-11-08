/* globals Vue, systems, Vector2D, tracery */

(function () {
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  // TEXT FROM GPT,
  // BACKGROUND FROM https://codepen.io/Busayyyo/pen/jOOWzLy

  let bot = {
    /*
     * A bot that can listen, think and speak
     */

    // Start with no messages
    messages: [],

    //=========================================================================================
    // TODO: custom data

    hide: false,
    name: "storyletbot", // Lowercase only no spaces! (we reuse this for some Vue stuff)
    description: "a bot does tells stories",
    chatControlsHeight: 100, // How big do your controls need to be?

    // From GPT!
    storylets: [
      {
        title: "A Quiet Moment",
        preconditions: { mood: "tired" },
        outcome: { newMood: "happy" },
        description:
          "After a long shift on the bridge, #ch1name# finds solace in the starlit tranquility of her quarters, turning her exhaustion into contentment.",
      },
      {
        title: "The Weight of Command",
        preconditions: { mood: "happy" },
        outcome: { newMood: "sad" },
        description:
          "#ch1name# receives news of a lost scout ship. Her happiness fades as the reality of her responsibilities weighs heavily upon her.",
      },
      {
        title: "An Unexpected Anomaly",
        preconditions: { mood: "sad" },
        outcome: { newMood: "scared" },
        description:
          "While analyzing star maps, #ch1name# discovers an unknown anomaly that threatens the ship, igniting fear for the safety of her crew.",
      },
      {
        title: "Confrontation",
        preconditions: { mood: "scared" },
        outcome: { newMood: "angry" },
        description:
          "#ch1name#'s fear turns to anger when she confronts the engineer who neglected to report the faulty sensors that failed to detect the anomaly.",
      },
      {
        title: "The Engineer's Apology",
        preconditions: { mood: "angry" },
        outcome: { newMood: "hopeful" },
        description:
          "After the engineer offers a heartfelt apology and presents a solution, #ch1name#'s anger subsides, leaving her feeling hopeful for the future.",
      },
      {
        title: "Restoring Balance",
        preconditions: { mood: "hopeful" },
        outcome: { newMood: "tired" },
        description:
          "With the anomaly neutralized and her ship safe, the adrenaline fades and #ch1name# feels the exhaustion from the day's events.",
      },

      {
        title: "The Stowaway Critter",
        preconditions: { mood: "sad" },
        choices: {
          lasers: {
            success: {
              newMood: "happy",
              description:
                "Miraculously, #ch1name# uses a low-power laser to guide the critter into a safe containment unit, turning their sadness into a joyful rescue mission success.",
            },
            failure: {
              newMood: "angry",
              description:
                "The laser only startles the critter, which dashes into the ship's circuitry, causing havoc. #ch1name#'s sadness turns to frustration.",
            },
          },
          feelings: {
            success: {
              newMood: "happy",
              description:
                "#ch1name#'s gentle approach calms the critter, which cozily nestles into their hands. Their sadness melts away with each tiny, trusting nuzzle.",
            },
            failure: {
              newMood: "scared",
              description:
                "Trying to empathize with the critter, #ch1name# gets too close, and it bites. Now #ch1name# fears an alien infection.",
            },
          },
        },
        description:
          "#ch1name# discovers a mysterious critter hiding in the cargo bay. Feeling sad, they must choose how to safely capture it without causing harm.",
      },
      {
        title: "The Laughing Gas Leak",
        preconditions: { mood: "angry" },
        choices: {
          lasers: {
            success: {
              newMood: "hopeful",
              description:
                "With precise laser welding, #ch1name# seals the leak. The hope for a crisis-free day is restored among the crew.",
            },
            failure: {
              newMood: "happy",
              description:
                "The laser misfires, but the resulting noise patches the leak and gives everyone a good laugh, including the previously irate #ch1name#.",
            },
          },
          feelings: {
            success: {
              newMood: "happy",
              description:
                "Talking through the problem with the engineering team leads to a quick fix, turning #ch1name#'s anger into laughter along with the crew.",
            },
            failure: {
              newMood: "scared",
              description:
                "The attempt to talk it out wastes time, and the gas affects more crew. #ch1name# anxiously rounds up gas masks.",
            },
          },
        },
        description:
          "A hypospray malfunction has released laughing gas in medbay, and an angry #ch1name# must deal with the giggling chaos.",
      },
      {
        title: "Cosmic Karaoke Night",
        preconditions: { mood: "hopeful" },
        choices: {
          lasers: {
            success: {
              newMood: "happy",
              description:
                "A laser light show syncs perfectly with #ch1name#'s singing, making it the most epic karaoke the #shipname# has ever seen.",
            },
            failure: {
              newMood: "sad",
              description:
                "The laser show malfunctions, but #ch1name#'s hopeful spirit isn't easily dimmed—they turn the flub into a humorous dance-off.",
            },
          },
          feelings: {
            success: {
              newMood: "happy",
              description:
                "#ch1name# chooses a song that resonates with the crew's homesickness, turning the night into a heartfelt bonding event.",
            },
            failure: {
              newMood: "angry",
              description:
                "The chosen song unexpectedly reminds the crew of a recent mission gone wrong, setting a somber mood that leaves #ch1name# frustrated.",
            },
          },
        },
        description:
          "It's karaoke night, and hopeful #ch1name# wants to lift everyone's spirits. Will they go for dazzling effects or try to tug at the crew's heartstrings?",
      },

      {
        title: "The Holodeck Mishap",
        preconditions: { mood: "sad" },
        description:
          "The holodeck's programming goes awry, trapping #ch1name# in a simulation of an endless maze. Their sadness from missing home adds to the challenge, but they persevere, finding their way out and discovering a new resilience within themselves.",
        outcome: {
          newMood: "hopeful",
          description:
            "Emerging from the holodeck, #ch1name# feels a renewed sense of hope, realizing that if they can conquer a virtual labyrinth, they can face the real challenges ahead.",
        },
      },
      {
        title: "The Spore Drive Dilemma",
        preconditions: { mood: "angry" },
        choices: {
          lasers: {
            success: {
              newMood: "happy",
              description:
                "After recalibrating the spore drive with a laser array, #ch1name#'s anger subsides as they feel a sense of accomplishment.",
            },
            failure: {
              newMood: "sad",
              description:
                "The recalibration fails and the drive is damaged further, deepening #ch1name#'s frustration to sadness.",
            },
          },
          feelings: {
            success: {
              newMood: "hopeful",
              description:
                "By talking through their frustrations, #ch1name# helps the team find a solution, fostering a newfound hope in their capabilities.",
            },
            failure: {
              newMood: "angry",
              description:
                "The lack of progress leads to a heated argument, leaving #ch1name# even angrier than before.",
            },
          },
        },
        description:
          "The ship's experimental spore drive is malfunctioning, and an irate #ch1name# must choose between a technical or diplomatic resolution.",
      },
      {
        title: "The Zero-G Cake Catastrophe",
        preconditions: { mood: "scared" },
        description:
          "During #ch1name#'s birthday, the artificial gravity fails, sending their cake floating in zero-G. The crew bands together to catch floating cake pieces, turning #ch1name#'s initial fear into an unexpected zero-gravity party.",
        outcome: {
          newMood: "happy",
          description:
            "Laughter fills the room as #ch1name# and the crew enjoy cake in the most unconventional way, bringing joy to what could have been a disaster.",
        },
      },
      {
        title: "The Diplomatic Dance-Off",
        preconditions: { mood: "hopeful" },
        choices: {
          lasers: {
            success: {
              newMood: "happy",
              description:
                "#ch1name# programs the holodeck to create an impressive laser show, which mesmerizes the alien delegates during the dance.",
            },
            failure: {
              newMood: "scared",
              description:
                "The laser show is too intense, frightening the alien delegates and causing a diplomatic scare.",
            },
          },
          feelings: {
            success: {
              newMood: "happy",
              description:
                "Relying on cultural research, #ch1name# performs a dance that perfectly respects the alien's customs, strengthening diplomatic relations.",
            },
            failure: {
              newMood: "angry",
              description:
                "Misinterpreting the alien's customs, #ch1name# accidentally performs a dance of war, leading to an awkward situation.",
            },
          },
        },
        description:
          "The ship hosts a delegation of aliens who communicate through dance. Hopeful #ch1name# must choose how to engage with them.",
      },
      {
        title: "The Nebula Serenade",
        preconditions: { mood: "happy" },
        description:
          "A beautiful nebula inspires #ch1name# to write a song. They perform it for the crew, spreading their joy and the awe of space exploration.",
        outcome: {
          newMood: "hopeful",
          description:
            "The crew is touched by #ch1name#'s performance, leaving them feeling inspired and connected to the wonders of the universe.",
        },
      },
    ],

    // Make your own grammar for this bot, use GPT to help, or watch a tutorial!
    grammar: new tracery.Grammar({
      firstSyl: [
        "B",
        "C",
        "D",
        "F",
        "G",
        "Z",
        "St",
        "Fl",
        "Bl",
        "Pr",
        "Kr",
        "Ll",
        "Chr",
        "Sk",
        "Br",
        "Sth",
        "",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Qu",
        "R",
        "S",
        "T",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "Ch",
        "Dhr",
        "Dr",
        "Sl",
        "Sc",
        "Sh",
        "Thl",
        "Thr",
        "Pl",
        "Fr",
        "Phr",
        "Phl",
        "Wh",
      ],
      middleSyl: [
        "an",
        "all",
        "ar",
        "art",
        "air",
        "aean",
        "af",
        "av",
        "ant",
        "app",
        "ab",
        "er",
        "en",
        "eor",
        "eon",
        "ent",
        "enth",
        "irt",
        "ian",
        "ion",
        "iont",
        "ill",
        "il",
        "ipp",
        "in",
        "is",
        "it",
        "ik",
        "ob",
        "ov",
        "orb",
        "oon",
        "ion",
        "uk",
        "ub",
        "ul",
        "ar",
        "uf",
        "un",
        "ull",
        "urk",
        "estr",
        "antr",
        "okl",
        "ackl",
      ],
      lastSyl: [
        "a",
        "ia",
        "ea",
        "u",
        "y",
        "en",
        "am",
        "is",
        "on",
        "an",
        "o",
        "io",
        "i",
        "el",
        "ios",
        "ax",
        "ox",
        "ix",
        "ex",
        "izz",
        "ius",
        "ian",
        "ean",
        "ekang",
        "anth",
      ],
      alienName: [
        "#firstSyl##middleSyl##lastSyl#",
        "#firstSyl##lastSyl#",
        "#middleSyl.capitalize##lastSyl#",
        "#middleSyl.capitalize##middleSyl##lastSyl#",
        "#firstSyl.capitalize##lastSyl#-#firstSyl##lastSyl#",
      ],
      shipTypeStart: [
        "silver",
        "white",
        "far",
        "green",
        "great",
        "small",
        "wonder",
        "soul",
        "copper",
        "jelly",
        "mist",
        "steel",
        "tin",
        "thread",
        "red",
        "iron",
        "gold",
        "grey",
        "blue",
        "holo",
        "hyper",
        "transmuto",
        "digi",
        "nano",
        "electro",
        "bright",
        "planet",
        "sea",
        "fairy",
        "elf",
        "sun",
        "star",
        "joy",
        "terror",
        "free",
        "wave",
        "watch",
        "brain",
        "neuro",
        "femto",
        "transma",
        "magna",
        "magneto",
        "#middleSyl##lastSyl#",
        "fire",
        "water",
        "wander",
        "vision",
        "air",
        "earth",
        "skip",
        "grand",
        "photo",
        "spyro",
        "century",
        "space",
        "long",
        "iris",
        "cranial",
        "deep",
        "broad",
        "shadow",
        "thunder",
        "flash",
        "dust",
        "galacti",
        "nebula",
        "dark",
        "nano",
        "alcyon",
        "aether",
        "air",
        "pico",
        "acro",
        "death",
        "light",
        "aero",
      ],
      shipTypeEnd: [
        "dredge",
        "clipper",
        "quest",
        "rover",
        "rocket",
        "shuttle",
        "transport",
        "plane",
        "ray",
        "wave",
        "beam",
        "flight",
        "fish",
        "fly",
        "visor",
        "bus",
        "shell",
        "body",
        "road",
        "path",
        "seeker",
        "spirit",
        "skip",
        "turn",
        "vector",
        "flight",
        "shadow",
        "eagle",
        "express",
        "flash",
        "wing",
        "comet",
        "heart",
        "mind",
        "spear",
        "sword",
        "blossom",
        "bloom",
        "fire",
        "slide",
        "jet",
        "jumper",
        "ghost",
        "falcon",
        "jack",
        "ship",
        "star",
        "leaf",
        "cruiser",
        "watch",
        "sparrow",
        "bee",
        "wasp",
        "stinger",
        "fish",
        "squid",
        "cloud",
        "claw",
        "whale",
        "hold",
        "stream",
        "wind",
      ],
      shipType: ["#shipTypeStart##shipTypeEnd#"],
      shipName: [
        "#alienName# #shipType.capitalize#",
        "The #alienName# #shipTypeEnd.capitalize#",
        "#alienName# #shipTypeEnd.capitalize#",
        "#shipType.capitalize#",
        "The #firstSyl.capitalize##middleSyl##middleSyl##lastSyl#",
        "The #shipTypeStart.capitalize# #shipType.capitalize#",
      ],
      cha: [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
      ],
      id: ["#cha##cha##cha##cha#"],
      zeroone: ["", "1"],
      smallDigit: ["1", "2", "3", "4", "5"],
      smallNegDigit: ["-1", "-2", "-0", "0", "1", "2", "3", "4"],
      largeNegDigit: ["-1", "-2", "-3", "-4", "-0", "0", "1", "2"],
      midDigit: ["3", "4", "5", "6"],
      largeDigit: ["5", "6", "7", "8", "9"],
      digit: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
      ],
      num: ["#smallDigit##digit#"],
      num2: ["#digit##digit#"],
      num3: ["#midDigit##digit#"],
      r255Start: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
      ],
      r255: ["#r255Start##digit#"],
      vector: ["#num#,#num#"],
      narrowVector: "#zeroone##digit#,#num2#",
      smallVector: "#zeroone##digit#,#zeroone##digit#",
      gradient:
        '<linearGradient id="#gradID#" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#darkColor#;stop-opacity:1" /><stop offset="100%" style="stop-color:#svgColor#;stop-opacity:1" /></linearGradient>',
      vertex: ["C#vector# #vector# #vector#", "L#vector#"],
      narrowVertex: [
        "C#narrowVector# #vector# #narrowVector#",
        "L#narrowVector#",
      ],
      blade: [
        "<path id='#bladeID#' fill='url(\\##gradID#)' d='M0 0 #vertex# #vertex# Z'/>",
      ],
      transform: "<g transform='translate(10) rotate(45 50 50)>",
      bladeWing: [
        '<g transform="translate(0, #largeNegDigit#)">#blade#<use xlink:href="\\##bladeID#" transform="rotate(0) scale(1)"/> <use xlink:href="\\##bladeID#" transform="rotate(14) scale(1.2)" /><use xlink:href="\\##bladeID#" transform="rotate(28)" scale(1.6)/></g>',
      ],
      svgColor: ["hsl(#r255#, #largeDigit##digit#%, #largeDigit##digit#%)"],
      darkColor: ["hsl(#r255#, #digit##digit#%, #digit##digit#%)"],
      svgStyle: ['fill="url(\\##gradID#)" fill-opacity="0.7"'],
      shipShape: [
        "<path fill='#svgColor#' fill-opacity='0.9' transform='translate(0, #largeNegDigit##digit#)' d='M0 0 #narrowVertex# #narrowVertex# L0,120'/>",
      ],
      shipSide: ["<g id='#sideID#'>#bladeWing##shipShape##cockpit#</g>"],
      cockpit: [
        "<path fill='\\#000000' fill-opacity='0.4' d='M0 #smallNegDigit##digit#  C 1#digit#,9 1#digit#,25 0,1#digit# Z'/>",
      ],
      ship: [
        "[gradID:#id#][bladeID:#id#][sideID:#id#]#gradient#<g transform='translate(120, 100) rotate(#digit##digit#)'>#shipSide#<g transform='scale(-1, 1)'> <use xlink:href='\\##sideID#'></g></g>",
      ],
      label:
        '<text text-anchor="end" fill="\\#FFFFFF" fill-opacity="0.4" font-size="12" font-family="Verdana" x="225" y="250">#shipName#</text>',
      bg: [
        "<rect fill='\\#000000' x='0' y='0' width='300' height='300'/>#starField#",
      ],
      star: [
        "<circle fill='\\#FFFFFF' cx='#r255#' cy='#r255#' r='#zeroone#.#digit#'/>",
      ],
      starField: [
        "#star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star##star#",
      ],
      svgImg: [
        '<svg viewBox="0 0 256 256" width="256" height="256">#ship#</svg>',
      ],

      origin: "{svg #svgImg#}",
    }),

    // What kind of data does your bot need?
    // this bot needs the ship and crew
    waitingOnChoice: undefined, // A choice that needs user input
    moods: ["sad", "happy", "scared", "angry", "hopeful"],
    crew: [],
    ship: {
      food: 100,
      name: "The Nameless",
    },

    //=========================================================================================
    // events

    setup() {
      console.log("Setup", this.name);
      // TODO: does this bot need any setup?
      // Should it say something when it starts?

      // Setup this bot
      // 		  sad, happy, scared, angry, or hopeful,

      // Name the ship

      this.ship.name = this.grammar.flatten("#shipname#");
      this.ship.svg = this.grammar.flatten("#svgImg#");

      this.crew.push({
        name: "Captain " + this.grammar.flatten("#alienName#"),
        mood: "happy",
        lasers: Math.floor(Math.random() * 5) + 1,
        feelings: Math.floor(Math.random() * 5) + 1,
      });

      setInterval(() => {
        if (!this.waitingOnChoice) {
          this.updateSimulation();
          this.tellStory();
        }
      }, 1000);
    },

    updateSimulation() {
      // SIMULATIONIST!
      // Everybody eat some food
      this.ship.food -= this.crew.length;
    },

    updateGrammar() {
      // Update the grammar with any info we need for the templates
      this.grammar.raw.ch1name = this.mainCharacter.name;
      this.grammar.raw.shipname = this.ship.name;
      this.grammar = new tracery.Grammar(this.grammar.raw);
    },

    tellStory() {
      // STORYLETS!
      /// Lets tell some more of the story
      // Do we have available storylets?

      // Set who the main character is, and add it to the grammar
      this.mainCharacter = this.crew[0];
      this.updateGrammar();

      let storylet = this.getStorylet(this.mainCharacter);
      console.log(
        storylet.title,
        storylet.preconditions.mood,
        storylet.choices
      );

      // Post a storylet, using Tracery to expand any templates
      let expandedText = this.grammar.flatten(storylet.description);
      this.messages.push({
        text: expandedText,
        from: "bot",
      });

      // THINK

      // Is there a choice to be made?
      if (storylet.choices) {
        console.log("CHOICES!");

        this.waitingOnChoice = storylet;
        console.log("wAiting on", this.waitingOnChoice);
      } else {
        // Do the outcome right away
        this.doOutcome(storylet.outcome, this.mainCharacter);
      }
    },

    doOutcome(outcome, character) {
      // Given an outcome, do it!

      character.mood = outcome.newMood;

      if (outcome.description) {
        // Use tracery to expand stuff
        let expandedText = this.grammar.flatten(outcome.description);
        console.log(this.grammar);
        this.messages.push({
          text: expandedText,
          from: "bot",
        });
      }
      this.messages.push({
        text: `<b>${character.name} is now ${character.mood}</b>`,
        from: "bot",
      });
    },

    getStorylet(character) {
      // From our storylets, get one that matches
      let matching = this.storylets.filter((storylet) => {
        return character.mood === storylet.preconditions.mood;
      });
      matching = shuffle(matching);
      console.log(
        `${matching.length} matching storylets (${
          character.mood
        }): ${matching.map((s) => "'" + s.title + "'")} `
      );
      let selected = matching[0];
      return selected;
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

      // Did we get an input when we are waiting for some user decision?
      if (this.waitingOnChoice) {
        // Which choice?
        let option = this.waitingOnChoice.choices[text];
        console.log("User chose", text, option);

        // Do we succeed or fail?
        // Check the skill level
        let skill = this.mainCharacter[text];
        let requiredPoints = 4;
        let succeed =
          Math.random() * skill + Math.random() * 2 > requiredPoints;
        let outcome = succeed ? option.success : option.failure;

        this.doOutcome(outcome, this.mainCharacter);

        // Clear this choice
        this.waitingOnChoice = undefined;
      }

      //==============================================
      // SPEAK - What should the bot do now?
      //  this is a good time to pretend that you (the bot) are thinking deeply
      //  - even if you are faking it -- artificial intelligence is theater
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
        <table>
          <tr v-for="m in bot.crew">
            <td>{{m.name}}</td>
            <td>{{m.mood}}</td>
            <td>{{'💔'.repeat(m.feelings)}}</td>
            <td>{{'🔫'.repeat(m.lasers)}}</td>
          </tr>
        
        </table>
        
        
        <div v-html="bot.ship.svg"/>
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
              <!-- Lasers or feelings? -->
        <span v-if="bot.waitingOnChoice !== undefined">
             <button @click="useFeelings">💔</button><button @click="useLasers">🔫</button>
         </span>
         
         <button  @click="travel">🪐</button>
  
          </div>`,

    methods: {
      useLasers() {
        this.bot.input({ text: "lasers", from: "user" });
      },
      useFeelings() {
        this.bot.input({ text: "feelings", from: "user" });
      },
      travel() {
        this.bot.input({ text: "travel", from: "user" });
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
