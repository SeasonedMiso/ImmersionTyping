<template>
  <div class="test-text">
    <p>
      <span class="wpm"
        >wpm: {{ wpm }} cpm: {{ cpm }} mistypes: {{ mistypeCounter }}</span
      >
    </p>

    <span v-if="!firstCycleBool" class="sentence"
      ><span class="typedChars semiBlur">{{ typedChars }}</span
      ><span class="currentWordStart typing">{{
        currentWord.substring(0, letterPositionIndex)
      }}</span>
      <span class="textCursor" content="tempCont"
        ><span v-if="mistypeBool" style="color: red">{{ textCursor }}</span
        ><span v-else style="color: black">{{ textCursor }}</span></span
      ><span class="currentWordEnd"
        >{{ currentWord.substring(letterPositionIndex, currentWord.length) }}
      </span>
      <span class="notYetTyped">{{ notYetTyped }}</span>

      <br />
      <span class="blurrySentences" style="white-space: pre">{{
        blurrySentences
      }}</span>
    </span>
    <br />

    <p v-if="firstCycleBool">press space to start</p>
  </div>
</template>

<script>
// import Vue from "vue";
import keycode from "keycode";
const allSentences = require("../assets/json/sentences.json");
// const allSentences = require("../assets/json/slowsentences.json");
// const allSentences = require("../assets/json/harrypotter.json");

const textCursors = ["|", " "];

// add alphabet, nums, then special chars
let acceptableChars = Array.from(new Array(26), (x, i) => i + 65)
  .concat(Array.from(new Array(9), (x, i) => i + 49))
  .concat(40, 49, 50, 55, 58, 59, 188, 190, 191);

export default {
  name: "English",
  data() {
    return {
      rawInput: "",
      typedChars: "",
      notYetTyped: "",
      sentence: "",
      blurrySentences: "",
      currentWord: "",
      splitSentence: "",
      letterPositionIndex: 0,
      mistypeCounter: 0,
      startTime: 0,
      endTime: 0,
      wordPositionIndex: 0,
      wpm: 0,
      cpm: 0,
      firstCycleBool: true,
      mistypeBool: false,
      typingSoundBool: false,
      sentenceStock: [],
      textCursor: textCursors[0],
    };
  },
  mounted() {
    window.addEventListener(
      "keydown",
      function (event) {
        if (event.ctrlKey || event.shiftKey || event.metaKey) {
          const char = event.which || event.keyCode; // get key code
          // kill browser hotkeys
          switch (char) {
            case 55: //block '
              event.preventDefault();
              this.addCharToRawInput("'");
              break;
          }
        }
        if (keycode.isEventKey(event, "backspace")) {
          this.rawInput = this.rawInput.slice(0, -1);
          if (this.letterPositionIndex > 0) this.letterPositionIndex--;
        }
        if (keycode.isEventKey(event, "space")) {
          this.spaceBarPress();
        }
        // normal chars
        if (acceptableChars.includes(event.keyCode)) {
          let inputtedChar = keycode(event.keyCode);
          this.addCharToRawInput(inputtedChar);
        }

        if (this.typingSoundBool) {
          this.randomClick();
        }
      }.bind(this)
    );
  },

  methods: {
    addCharToRawInput(inputtedChar) {
      if (
        this.letterPositionIndex >=
        this.splitSentence[this.wordPositionIndex].length
      ) {
        return;
      }
      console.log(
        inputtedChar.toLowerCase(),
        this.splitSentence[this.wordPositionIndex][
          this.letterPositionIndex
        ].toLowerCase()
      );
      this.mistypeBool = !(
        this.splitSentence[this.wordPositionIndex][
          this.letterPositionIndex
        ].toLowerCase() == inputtedChar.toLowerCase()
      );
      if (!this.mistypeBool) {
        this.rawInput += inputtedChar;
        this.letterPositionIndex++;
        return null;
      }
      this.mistypeCounter++;
    },

    getSentence() {
      return allSentences[Math.floor(Math.random() * allSentences.length)];
    },

    populateSentenceStock() {
      while (this.sentenceStock.length < 5) {
        let tempSentence = this.getSentence();
        if (
          tempSentence !== this.sentenceStock.slice(-1)[0] ||
          this.sentenceStock.length === 0
        ) {
          this.sentenceStock.push(tempSentence);
        }
      }
    },

    initialize() {
      this.wordPositionIndex = this.startTime = this.endTime = 0;
      this.rawInput = this.typedChars = "";
      this.firstCycleBool = false;

      this.populateSentenceStock();
      this.sentence = this.sentenceStock.shift();
      this.blurrySentences = this.sentenceStock.join("\n");
      this.notYetTyped = this.sentence
        .split(" ")
        .splice(1, this.sentence.length)
        .join(" ");
      this.splitSentence = this.sentence.split(" ");
      this.currentWord = this.sentence.split(" ")[0];
    },

    spaceBarPress() {
      const splitSentence = this.sentence.split(" ");
      this.currentWord = splitSentence[this.wordPositionIndex];

      if (this.startTime === 0) {
        this.startTime = new Date().getTime();
      }

      const lowerCaseRawIn = this.rawInput.replace(/\s+/g, "").toLowerCase();

      if (
        !this.firstCycleBool &&
        lowerCaseRawIn === this.currentWord.toLowerCase()
      ) {
        this.nextWord(splitSentence);
      }

      if (this.firstCycleBool) {
        this.initialize();
      }
    },

    nextWord(splitSentence) {
      this.letterPositionIndex = 0;
      this.rawInput = this.rawInput.replace(/\s+/g, "");
      this.typedChars += splitSentence[this.wordPositionIndex] + " ";
      this.notYetTyped = this.notYetTyped
        .split(" ")
        .splice(1, this.sentence.split(" ").length)
        .join(" ");

      this.wordPositionIndex++;
      this.currentWord = splitSentence[this.wordPositionIndex];
      if (this.wordPositionIndex >= splitSentence.length) {
        this.nextSentence(splitSentence);
      }
      this.rawInput = "";
    },

    nextSentence(splitSentence) {
      this.endTime = new Date().getTime();
      const timeElapsed = (this.endTime - this.startTime) * 1.66667e-5;

      const preRoundWpm = Math.round((splitSentence.length / timeElapsed) * 10);
      const preRoundCpm = Math.round(
        (splitSentence.toString().length / timeElapsed) * 10
      );

      this.wpm = (preRoundWpm / 10).toFixed(1);
      this.cpm = (preRoundCpm / 10).toFixed(1);

      this.initialize();
    },

    rain() {
      const rain = new Audio(require("@/assets/sounds/rain.mp3"));
      rain.play();
    },

    randomClick() {
      const audio0 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-00-c-FesliyanStudios.com-glued.wav")
      );
      const audio1 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-01-c-FesliyanStudios.com-glued.wav")
      );
      const audio2 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-02-c-FesliyanStudios.com-glued.wav")
      );
      const audio3 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-03-c-FesliyanStudios.com-glued.wav")
      );
      const audio4 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-04-c-FesliyanStudios.com-glued.wav")
      );
      const audio5 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-05-c-FesliyanStudios.com-glued.wav")
      );
      const audio6 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-06-c-FesliyanStudios.com-glued.wav")
      );
      const audio7 = new Audio(
        require("@/assets/sounds/Keyboard-Button-Click-07-c-FesliyanStudios.com-glued.wav")
      );
      let audioList = [
        audio0,
        audio1,
        audio2,
        audio3,
        audio4,
        audio5,
        audio6,
        audio7,
      ];
      audioList[Math.floor(Math.random() * 8)].play();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.sentence {
  font-size: 150%;
  color: rgb(185, 185, 185);
}
.typedChars {
  color: rgb(90, 90, 90);
}
.button {
  font-family: "Font Awesome 5 Free", sans-serif;
  font-weight: 900; /* Needed for font awesome to work... */
}
.blurrySentences {
  color: transparent;
  text-shadow: 0 0 4px rgb(185, 185, 185);
}
.semiBlur {
  text-shadow: 0 0 2px rgb(202, 202, 202);
}
.typing {
  color: rgb(133, 169, 219);
}
/* .textCursor {
} */
</style>
