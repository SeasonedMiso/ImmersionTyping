<template>
  <div class="test-text">
    <p>
      <span class="wpm">wpm: {{ wpm }} cpm: {{ cpm }}</span>
    </p>
    <span v-if="!firstCycle" class="sentence"
      ><span class="typed semiBlur">{{ typed }}</span>
      <span class="currentWordStart typing">{{
        currentWord.substring(0, wordPosIndex)
      }}</span>
      <span class="textCursor" content="tempCont"
        ><span v-if="mistype" style="color: red">{{ textCursor }}</span
        ><span v-else style="color: black">{{ textCursor }}</span></span
      >

      <span class="currentWordEnd"
        ><ruby
          >{{ currentWord.substring(wordPosIndex, currentWord.length) }}
          <rp>(</rp><rt class="typing">{{ ruby }}{{ remainderChars }} </rt
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
    <p v-if="firstCycle">press space to start</p>
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
      typingSoundBool: false,
      msg: "",
      typed: "",
      notYetTyped: "",
      sentence: "",
      kanjiSentenceStock: [],
      kanaSentenceStock: [],
      blurrySentences: "",
      kanaSent: [],
      kanjiSent: [],
      onScreen: "",
      currentWord: "",
      remainderChars: "",
      ruby: "",
      wordPosIndex: 0,
      mistype: false,
      kanaValid: false,
      words: "",
      textCursor: textCursors[0],
      startTime: 0,
      endTime: 0,
      counter: 0,
      firstCycle: true,
      wpm: 0,
      cpm: 0,
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
              this.addCharToMsg("'");
              break;
          }
        }
        if (this.typingSoundBool) {
          this.randomClick();
        }
        //backspace
        if (e.keyCode == 8) {
          if (this.msg != "") {
            this.msg = this.msg.slice(0, -1);
            this.remainderChars = this.remainderChars.slice(0, -1);
          } else {
            this.ruby = this.ruby.slice(0, -1);
            if (this.mistype) {
              this.mistype = false;
            }
          }
        }
        //normal chars
        if (acceptableChars.includes(e.keyCode) && !this.mistype) {
          let inputtedChar = String.fromCharCode(e.keyCode);
          this.addCharToMsg(inputtedChar);
        }

        //space or enter
        if (e.keyCode === 32 || e.keyCode === 13) {
          this.update();
        }
      }.bind(this)
    );
  },

  methods: {
    validateFuri() {
      if (
        this.kanaSent[this.counter].substr(-1) == "ん" &&
        this.remainderChars == "n"
      ) {
        return this.ruby == this.kanaSent[this.counter].slice(0, -1);
      }
      return this.ruby == this.kanaSent[this.counter];
    },
    validateReading(kana) {
      if (kana.length == 1) {
        if (this.kanaSent[this.counter][this.wordPosIndex] == kana) {
          this.wordPosIndex += 1;
          this.msg = "";
          this.remainder = "";
          this.ruby = "";
        }
        if (
          this.kanaSent[this.counter][this.wordPosIndex] != kana &&
          this.ruby.length > 0
        ) {
          this.mistype = true;

          this.msg = "";
        }
        if (this.wordPosIndex == this.kanaSent[this.counter].length) {
          this.validKana = true;
          this.update();
        }
      }
      console.log(this.validKana);
    },
    addCharToMsg(inputtedChar) {
      if (this.wordPosIndex < this.kanaSent[this.counter].length) {
        if (/^([ぁ-んァ-ン]*)$/.test(this.kanjiSent[this.counter])) {
          this.msg += inputtedChar;
          if (inputtedChar.toLowerCase() != "n") {
            this.ruby += wanakana.toHiragana(this.msg).replace(/[a-z]/g, "");
            this.remainderChars = wanakana
              .toHiragana(this.msg)
              .replace(/[ぁ-んァ-ン]/g, "");
            console.log(inputtedChar);
            if (this.ruby.length > 0) {
              this.validateReading(this.ruby[0]);
              console.log(inputtedChar);
            }
          } else if (
            this.msg.length <= 1 &&
            inputtedChar.toLowerCase() == "n"
          ) {
            this.remainderChars += "n";
          } else if (this.msg.length > 1 && this.msg[0].toLowerCase() == "n") {
            this.msg = this.msg.slice(0, -1);
            this.ruby += wanakana.toHiragana(this.msg).replace(/[a-z]/g, "");
            this.msg = "";
            this.remainderChars = "";
            this.validateReading(this.ruby[0]);
          }
        }
        //if kanji let user type whole word, then space or enter validate word to move cursor
        else if (/^([[一-龯]*)$/.test(this.kanjiSent[this.counter])) {
          this.msg += inputtedChar;
          if (inputtedChar.toLowerCase() != "n") {
            let a = this.ruby.length;
            this.ruby += wanakana.toHiragana(this.msg).replace(/[a-z]/g, "");
            this.remainderChars = wanakana
              .toHiragana(this.msg)
              .replace(/[ぁ-んァ-ン]/g, "");
            let b = this.ruby.length;
            if (b - a > 0) {
              this.msg = "";
            }
          } else if (
            this.msg.length <= 1 &&
            inputtedChar.toLowerCase() == "n"
          ) {
            this.remainderChars += "n";
          } else if (this.msg.length > 1 && this.msg[0].toLowerCase() == "n") {
            this.msg = this.msg.slice(0, -1);
            this.remainderChars = "";
            this.ruby += wanakana.toHiragana(this.msg).replace(/[a-z]/g, "");
            this.msg = "";
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

    clear() {
      this.msg = null;
    },

    initialize() {
      this.counter = 0;
      this.msg = "";
      this.typed = "";
      this.startTime = 0;
      this.endTime = 0;
      this.firstCycle = false;

      while (this.kanjiSentenceStock.length < 5) {
        this.getSentence();
        if (
          this.kanjiSent !=
            this.kanjiSentenceStock[this.kanjiSentenceStock.length - 1] ||
          this.kanjiSentenceStock.length == 0
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
      this.words = this.kanjiSent;
      this.currentWord = this.kanjiSent[0];
    },

    update() {
      //init
      this.wordPosIndex = 0;
      if (this.startTime == 0) {
        this.startTime = new Date().getTime();
      }
      if (!this.firstCycle) {
        if (this.validateFuri() || this.validKana) {
          this.msg = this.msg.replace(/\s+/g, "");
          this.typed += this.kanjiSent[this.counter] + " ";
          this.notYetTyped = this.notYetTyped
            .split(" ")
            .splice(1, this.kanjiSent.length)
            .join(" ");

          this.counter += 1;
          this.currentWord = this.kanjiSent[this.counter];

          //reach end of sentence
          if (this.counter >= this.kanjiSent.length) {
            this.endTime = new Date().getTime();
            this.kanjiSent.length;
            this.wpm = (
              Math.round(
                (this.kanjiSent.length /
                  ((this.endTime - this.startTime) * 1.66667e-5)) *
                  10
              ) / 10
            ).toFixed(1);
            this.cpm = (
              Math.round(
                (this.kanjiSent.toString().length /
                  ((this.endTime - this.startTime) * 1.66667e-5)) *
                  10
              ) / 10
            ).toFixed(1);
            this.initialize();
            this.counter = 0;
          }
        }
      }
      this.ruby = "";
      this.msg = "";
      this.remainderChars = "";
      this.validKana = false;
      this.mistype = false;
      if (this.firstCycle) {
        this.initialize();
      }
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
.typed {
  color: rgb(90, 90, 90);
}
/* .notyet {
  color: rgb(202, 39, 39);
} */
.button {
  font-family: "Font Awesome 5 Free", sans-serif;
  font-weight: 900; /* Needed for font awesome to work... */
}
.blurrySentences {
  color: transparent;
  text-shadow: 0 0 4px rgb(185, 185, 185);
}
.semiBlur {
  /* color: transparent; */
  text-shadow: 0 0 2px rgb(202, 202, 202);
}
.typing {
  color: rgb(133, 169, 219);
}
/* .textCursor {
} */
</style>
