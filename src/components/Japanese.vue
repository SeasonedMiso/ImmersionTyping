<template>
  <div class="test-text">
    <p>
      <span class="wpm"
        >Kana/Min:
        <span class="statPoint"> {{ kanaPerMin }} </span>Character/Min:
        <span class="statPoint"> {{ cpm }} </span>Mistypes:
        <span class="statPoint"> {{ mistypeCounter }} </span></span
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
import keycode from "keycode";
const allSentences = require("../assets/json/test.json").sentences;
const textCursors = ["|", " "];

const normalChars = Array.from(new Array(26), (x, i) => i + 65).concat(
  Array.from(new Array(9), (x, i) => i + 49)
  // .concat([173])
);
// const specialChars = [40, 49, 50, 55, 58, 59, 173, 188, 190, 191];
const specialChars = [188, 190, 191];
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
      kanaPerMin: 0,
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
    //keyHandler
    window.addEventListener(
      "keydown",
      function (event) {
        // if (event.ctrlKey || event.shiftKey || event.metaKey) {
        //   const char = event.which || event.keyCode; // get key code
        //   switch (char) {
        //     case 55: //block '
        //       event.preventDefault();
        //       this.addCharToRawInput("'");
        //       break;
        //   }
        // }
        if (keycode.isEventKey(event, 55)) {
          event.preventDefault();
          this.addCharToRawInput("'");
        }
        if (keycode.isEventKey(event, 191)) {
          event.preventDefault();
          // this.addCharToRawInput("/");
        }
        if (this.firstCycleBool) {
          //space or enter
          if (
            keycode.isEventKey(event, "space") ||
            keycode.isEventKey(event, "enter")
          ) {
            this.spaceBarPress();
          }
          return;
        }
        if (!this.firstCycleBool) {
          let inputtedChar;
          //backspace
          if (keycode.isEventKey(event, "backspace")) {
            //refactor if else
            if (this.rawInput != "") {
              this.rawInput = this.rawInput.slice(0, -1);
              this.remainingRomajiInput = this.remainingRomajiInput.slice(
                0,
                -1
              );
              this.mistypeCounter += 1;
              return;
            }
            if (this.remainingRomajiInput != "") {
              this.remainingRomajiInput = this.remainingRomajiInput.slice(
                0,
                -1
              );

              this.mistypeCounter += 1;
              return;
            }
            this.ruby = this.ruby.slice(0, -1);
            this.mistypeCounter += 1;
            this.mistypeBool = false;
          }
          if (keycode.isEventKey(event, 173)) {
            inputtedChar = "-";
            this.addCharToRawInput(inputtedChar);
            return;
          }
          //normal chars
          if (normalChars.includes(event.keyCode) && !this.mistypeBool) {
            let inputtedChar = String.fromCharCode(event.keyCode);
            this.addCharToRawInput(inputtedChar);
          }
          if (specialChars.includes(event.keyCode) && !this.mistypeBool) {
            inputtedChar = keycode(event.keyCode);
            this.addCharToRawInput(inputtedChar);
          }
        }
        if (this.typingSoundBool) {
          this.randomClick();
        }
      }.bind(this)
    );
  },
  methods: {
    isKanji(word) {
      if (/^([[一-龯]*)$/.test(word)) {
        return true;
      }
      return false;
    },
    isAllKanji(word) {
      if (/^([[一-龯]*)$/.test(word)) {
        return true;
      }
      return false;
    },
    addCharToRawInput(inputtedChar) {
      this.rawInput += inputtedChar;
      this.currentWord = this.kanjiSent[this.wordPositionIndex];
      if (this.letterPositionIndex >= this.currentWord.length) {
        return;
      }
      if (wanakana.isKana(this.currentWord)) {
        if (inputtedChar !== "N") {
          this.inputKanaNotN(inputtedChar);
          return;
        }
        this.inputKanaN(inputtedChar);
        return;
      }
      if (inputtedChar !== "N") {
        this.inputKanjiNotN();
        return;
      }
      this.inputKanjiN(inputtedChar);
      return;
    },
    // inputKanaNotN() {
    //   console.log("kana");
    //   let initialRubyLength = this.ruby.length;

    //   this.ruby += wanakana.toHiragana(this.rawInput).replace(/[a-z]/g, "");
    //   this.remainingRomajiInput = wanakana
    //     .toHiragana(this.rawInput)
    //     .replace(/[ぁ-んァ-ン]/g, "");
    //   if (this.ruby.length > initialRubyLength) {
    //     this.validateKana(this.ruby[0]);
    //     this.remainingRomajiInput = "";
    //   }
    // },

    inputKanaNotN() {
      let firstRubyLength = this.ruby.length;
      if (
        this.remainingRomajiInput[this.remainingRomajiInput.length - 1] === "Y"
      ) {
        console.log("after y");
        this.remainingRomajiInput += this.rawInput;

        this.ruby += wanakana
          .toHiragana(this.remainingRomajiInput)
          .replace(/[a-z]/g, "");
        this;
        this.remainingRomajiInput = "";
        this.rawInput = "";
        return;
      }
      if (
        this.remainingRomajiInput[this.remainingRomajiInput.length - 1] === "N"
      ) {
        console.log("after n");
        if (this.rawInput == "Y") {
          console.log("y detected");
          this.remainingRomajiInput += this.rawInput;
          this.rawInput = "";
          return;
        }
        this.ruby += wanakana
          .toHiragana(this.remainingRomajiInput + this.rawInput)
          .replace(/[a-z]/g, "");
        if (this.remainingRomajiInput === "N") {
          this.remainingRomajiInput = "";
        }
        this.remainingRomajiInput += this.rawInput;
        this.rawInput = "";
        if (
          this.ruby.length - firstRubyLength > 0 &&
          this.ruby[this.ruby.length - 1] !== "ん"
        ) {
          this.isRubyComplete();
          this.remainingRomajiInput = "";
        }
        return;
      }
      this.ruby += wanakana.toHiragana(this.rawInput).replace(/[a-z]/g, "");
      this.remainingRomajiInput = wanakana
        .toHiragana(this.rawInput)
        .replace(/[ぁ-んァ-ン]/g, "");
      if (this.ruby.length > firstRubyLength) {
        this.validateKana(this.ruby[0]);
        this.remainingRomajiInput = "";
      }
    },
    inputKanaN(inputtedChar) {
      if (this.rawInput.length <= 1 && inputtedChar === "N") {
        this.remainingRomajiInput += "n";
      } else if (this.rawInput.length > 1 && this.rawInput[0] === "N") {
        this.rawInput = this.rawInput.slice(0, -1);
        this.ruby += wanakana.toHiragana(this.rawInput).replace(/[a-z]/g, "");
        this.rawInput = "";
        this.remainingRomajiInput = "";
        this.validateKana(this.ruby[0]);
      }
    },
    inputKanjiNotN() {
      let firstRubyLength = this.ruby.length;
      if (
        this.remainingRomajiInput[this.remainingRomajiInput.length - 1] === "Y"
      ) {
        this.remainingRomajiInput += this.rawInput;

        this.ruby += wanakana
          .toHiragana(this.remainingRomajiInput)
          .replace(/[a-z]/g, "");
        this;
        this.remainingRomajiInput = "";
        this.rawInput = "";
        return;
      }
      if (
        this.remainingRomajiInput[this.remainingRomajiInput.length - 1] === "N"
      ) {
        if (this.rawInput == "Y") {
          this.remainingRomajiInput += this.rawInput;
          this.rawInput = "";
          return;
        }
        this.ruby += wanakana
          .toHiragana(this.remainingRomajiInput + this.rawInput)
          .replace(/[a-z]/g, "");
        if (this.remainingRomajiInput === "N") {
          this.remainingRomajiInput = "";
        }
        this.remainingRomajiInput += this.rawInput;
        this.rawInput = "";
        if (
          this.ruby.length - firstRubyLength > 0 &&
          this.ruby[this.ruby.length - 1] !== "ん"
        ) {
          this.isRubyComplete();
          this.remainingRomajiInput = "";
        }
        return;
      }
      this.ruby += wanakana
        .toHiragana(this.remainingRomajiInput + this.rawInput)
        .replace(/[a-z]/g, "");
      if (this.remainingRomajiInput === "n") {
        this.remainingRomajiInput = "";
      }
      this.remainingRomajiInput += this.rawInput;
      this.rawInput = "";
      if (
        this.ruby.length - firstRubyLength > 0 &&
        this.ruby[this.ruby.length - 1] !== "ん"
      ) {
        this.remainingRomajiInput = "";
      }
      this.isRubyComplete();
    },
    inputKanjiN(inputtedChar) {
      if (
        this.remainingRomajiInput.length >= 1 &&
        this.remainingRomajiInput[0] === "N"
      ) {
        this.ruby += wanakana
          .toHiragana(this.remainingRomajiInput)
          .replace(/[a-z]/g, "");
        this.remainingRomajiInput = "";
        this.rawInput = "";
        this.isRubyComplete();
      } else if (this.remainingRomajiInput.length < 1 && inputtedChar === "N") {
        this.remainingRomajiInput += "N";
        this.rawInput = "";
      } else if (
        this.remainingRomajiInput.length >= 1 &&
        this.rawInput[this.rawInput.length - 1] == "N"
      ) {
        this.remainingRomajiInput += "N";
      }
    },
    isRubyComplete() {
      console.log(this.ruby, this.kanaSent[this.wordPositionIndex]);
      if (this.ruby === this.kanaSent[this.wordPositionIndex]) {
        console.log("eee");
        this.spaceBarPress();
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
        wanakana.toHiragana(
          this.kanaSent[this.wordPositionIndex][this.letterPositionIndex]
        ) === kana
      ) {
        this.letterPositionIndex++;
        this.rawInput = this.ruby = this.remaining = "";
      }
      if (
        wanakana.toHiragana(
          this.kanaSent[this.wordPositionIndex][this.letterPositionIndex]
        ) != kana &&
        this.ruby.length > 0
      ) {
        this.mistypeBool = true;
        this.mistypeCounter++;
        this.rawInput = this.ruby = "";
        //TODO: make it so mistype doesnt prevent typing, but goes away on keypress
        this.mistypeBool = false;
      }
      if (
        this.letterPositionIndex ===
        this.kanaSent[this.wordPositionIndex].length
      ) {
        this.validKana = true;
        this.spaceBarPress();
      }
    },
    populateSentenceStock() {
      while (this.kanjiSentenceStock.length < 5) {
        this.getSentence();
        if (
          JSON.stringify(this.kanjiSent) !=
            JSON.stringify(this.kanjiSentenceStock.slice(-1)[0]) ||
          this.kanjiSentenceStock.length == 0
        ) {
          this.kanjiSentenceStock.push(this.kanjiSent);
          this.kanaSentenceStock.push(this.kanaSent);
        }
      }
    },
    initialize() {
      this.wordPositionIndex = this.startTime = this.endTime = 0;
      this.rawInput = this.typedChars = "";
      this.firstCycleBool = false;
      this.populateSentenceStock();
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
      const timeElapsed = (this.endTime - this.startTime) * 1.66667e-5;

      this.cpm = (
        Math.round(
          (this.kanjiSent.toString().replaceAll(",", "").length / timeElapsed) *
            10
        ) / 10
      ).toFixed(1);

      this.kanaPerMin = (
        Math.round(
          (this.kanaSent.toString().replaceAll(",", "").length / timeElapsed) *
            10
        ) / 10
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
.statPoint {
  color: rgb(133, 169, 219);
}
/* .textCursor {
} */
</style>
