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
      >
      <span class="currentWordEnd"
        ><ruby
          >{{ currentWord.substring(letterPositionIndex, currentWord.length) }}
          <rp>(</rp><rt class="typing">{{ ruby }}{{ remainingRomajiInput }} </rt
          ><rp>)</rp></ruby
        ></span
      >
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

<script lang="ts">
// import Vue from "vue";

import * as wanakana from "wanakana";
const allSentences = require("../assets/json/test.json").sentences;
const textCursors = ["|", " "];

let acceptableChars = Array.from(new Array(26), (x, i) => i + 65)
  .concat(Array.from(new Array(9), (x, i) => i + 49))
  .concat(40, 188, 190);
export default {
  name: "Japanese",

  data() {
    return {
      rawInput: "",
      typedChars: "",
      notYetTyped: "",
      sentence: "",
      blurrySentences: "",
      currentWord: "",
      splitSentence: "",
      remainingRomajiInput: "",
      ruby: "",
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
      kanaValid: false,
      kanjiSentenceStock: [],
      kanaSentenceStock: [],
      kanaSent: [],
      kanjiSent: [],
      textCursor: textCursors[0],
    };
  },

  mounted() {
    window.addEventListener(
      "keydown",
      function (e) {
        if (e.ctrlKey || e.shiftKey || e.metaKey) {
          var c = e.which || e.keyCode; // get key code
          switch (c) {
            case 55: //block '
              e.preventDefault();
              this.addCharToRawInput("'");
              break;
          }
        }
        if (this.typingSoundBool) {
          this.randomClick();
        }
        //backspace
        if (e.keyCode === 8) {
          //refactor if else
          if (this.rawInput != "") {
            this.rawInput = this.rawInput.slice(0, -1);
            this.remainingRomajiInput = this.remainingRomajiInput.slice(0, -1);
          } else {
            this.ruby = this.ruby.slice(0, -1);
            this.mistypeBool = false;
          }
        }
        //normal chars
        if (acceptableChars.includes(e.keyCode) && !this.mistypeBool) {
          let inputtedChar = String.fromCharCode(e.keyCode);
          this.addCharToRawInput(inputtedChar);
        }
        //space or enter
        if (e.keyCode === 32 || e.keyCode === 13) {
          this.spaceBarPress();
        }
      }.bind(this)
    );
  },

  methods: {
    addCharToRawInput(inputtedChar) {
      //TODO: refactor all this mess
      if (
        this.letterPositionIndex < this.kanaSent[this.wordPositionIndex].length
      ) {
        //refactor nested if
        if (/^([ぁ-んァ-ン]*)$/.test(this.kanjiSent[this.wordPositionIndex])) {
          this.rawInput += inputtedChar;
          //refactor double nested if
          if (inputtedChar.toLowerCase() != "n") {
            this.ruby += wanakana
              .toHiragana(this.rawInput)
              .replace(/[a-z]/g, "");
            this.remainingRomajiInput = wanakana
              .toHiragana(this.rawInput)
              .replace(/[ぁ-んァ-ン]/g, "");
            console.log(inputtedChar);
            //refactor double nested if and else if chain
            if (this.ruby.length > 0) {
              this.validateKana(this.ruby[0]);
              console.log(inputtedChar);
            }
          } else if (
            this.rawInput.length <= 1 &&
            inputtedChar.toLowerCase() === "n"
          ) {
            this.remainingRomajiInput += "n";
          } else if (
            this.rawInput.length > 1 &&
            this.rawInput[0].toLowerCase() === "n"
          ) {
            this.rawInput = this.rawInput.slice(0, -1);
            this.ruby += wanakana
              .toHiragana(this.rawInput)
              .replace(/[a-z]/g, "");
            this.rawInput = "";
            this.remainingRomajiInput = "";
            this.validateKana(this.ruby[0]);
          }
        }
        //refactor else if
        //if kanji let user type whole word, then space or enter validate word to move cursor
        else if (/^([[一-龯]*)$/.test(this.kanjiSent[this.wordPositionIndex])) {
          this.rawInput += inputtedChar;
          //refactor nested if
          if (inputtedChar.toLowerCase() != "n") {
            let firstRubyLength = this.ruby.length;
            this.ruby += wanakana
              .toHiragana(this.rawInput)
              .replace(/[a-z]/g, "");
            this.remainingRomajiInput = wanakana
              .toHiragana(this.rawInput)
              .replace(/[ぁ-んァ-ン]/g, "");
            //refactor nested if
            if (this.ruby.length - firstRubyLength > 0) {
              this.rawInput = "";
            }
            //refactor nested else if chain
          } else if (
            this.rawInput.length <= 1 &&
            inputtedChar.toLowerCase() === "n"
          ) {
            this.remainingRomajiInput += "n";
          } else if (
            this.rawInput.length > 1 &&
            this.rawInput[0].toLowerCase() === "n"
          ) {
            this.rawInput = this.rawInput.slice(0, -1);
            this.remainingRomajiInput = "";
            this.ruby += wanakana
              .toHiragana(this.rawInput)
              .replace(/[a-z]/g, "");
            this.rawInput = "";
          }
        }
      }
    },

    getSentence() {
      let tempSentObj =
        allSentences[Math.floor(Math.random() * allSentences.length)];
      this.kanaSent = tempSentObj.kana.map((x) => x);
      this.kanjiSent = tempSentObj.sentence.map((x) => x);
    },

    validateRuby() {
      if (
        this.kanaSent[this.wordPositionIndex].substr(-1) === "ん" &&
        this.remainingRomajiInput === "n"
      ) {
        return this.ruby === this.kanaSent[this.wordPositionIndex].slice(0, -1);
      }
      if (this.ruby === this.kanaSent[this.wordPositionIndex]) {
        return true;
      }
      return false;
    },
    validateKana(kana) {
      //dont like that validateRuby has no in, but reading does
      if (kana.length != 1) {
        return null;
      }
      if (
        this.kanaSent[this.wordPositionIndex][this.letterPositionIndex] === kana
      ) {
        this.letterPositionIndex++;
        this.rawInput = this.ruby = this.remainder = "";
      }
      if (
        this.kanaSent[this.wordPositionIndex][this.letterPositionIndex] !=
          kana &&
        this.ruby.length > 0
      ) {
        this.mistypeBool = true;
        this.mistypeCounter++;
        this.rawInput = "";
      }
      if (
        this.letterPositionIndex ===
        this.kanaSent[this.wordPositionIndex].length
      ) {
        this.validKana = true;
        this.spaceBarPress();
      }
    },

    populateSentenceStock() {},
    initialize() {
      this.wordPositionIndex = this.startTime = this.endTime = 0;
      this.rawInput = this.typedChars = "";
      this.firstCycleBool = false;

      while (this.kanjiSentenceStock.length < 5) {
        this.getSentence();
        if (
          this.kanjiSent != this.kanjiSentenceStock.slice(-1)[0] ||
          this.kanjiSentenceStock.length === 0
        ) {
          this.kanjiSentenceStock.push(this.kanjiSent);
          this.kanaSentenceStock.push(this.kanaSent);
        }
      }
      this.kanjiSent = this.kanjiSentenceStock.shift();
      this.kanaSent = this.kanaSentenceStock.shift();
      this.blurrySentences = this.kanjiSentenceStock
        .join("\n")
        .replaceAll(",", "");
      let tempSent = this.kanjiSent.map((x) => x);
      this.notYetTyped = tempSent.splice(1, tempSent.length).join(" ");
      this.splitSentence = this.kanjiSent;
      this.currentWord = this.kanjiSent[0];
    },

    spaceBarPress() {
      this.letterPositionIndex = 0;
      if (this.startTime === 0) {
        this.startTime = new Date().getTime();
      }
      //refactor
      if (!this.firstCycleBool) {
        if (this.validateRuby() || this.validKana) {
          this.nextWord();
        } else {
          this.mistypeCounter++;
        }
      }
      this.ruby = this.rawInput = this.remainingRomajiInput = "";
      this.validKana = this.mistypeBool = false;
      if (this.firstCycleBool) {
        this.initialize();
      }
    },

    nextWord() {
      this.rawInput = this.rawInput.replace(/\s+/g, "");
      this.typedChars += this.kanjiSent[this.wordPositionIndex] + " ";
      this.notYetTyped = this.notYetTyped
        .split(" ")
        .splice(1, this.kanjiSent.length)
        .join(" ");

      this.wordPositionIndex++;
      this.currentWord = this.kanjiSent[this.wordPositionIndex];
      if (this.wordPositionIndex >= this.kanjiSent.length) {
        this.nextSentence();
      }
    },

    nextSentence() {
      this.endTime = new Date().getTime();
      let timeElapsed = (this.endTime - this.startTime) * 1.66667e-5;
      this.wpm = (
        Math.round((this.kanjiSent.length / timeElapsed) * 10) / 10
      ).toFixed(1);
      this.cpm = (
        Math.round((this.kanjiSent.toString().length / timeElapsed) * 10) / 10
      ).toFixed(1);
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
