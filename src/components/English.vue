<template>
  <div class="test-text">
    <p>
      <span class="wpm"
        >wpm: {{ wpm }} cpm: {{ cpm }} mistypes: {{ mistypeCounter }}</span
      >
    </p>

    <span v-if="!firstCycle" class="sentence"
      ><span class="typed semiBlur">{{ typed }}</span
      ><span class="currentWordStart typing">{{
        currentWord.substring(0, wordPosIndex)
      }}</span>
      <span class="textCursor" content="tempCont"
        ><span v-if="mistype" style="color: red">{{ textCursor }}</span
        ><span v-else style="color: black">{{ textCursor }}</span></span
      ><span class="currentWordEnd"
        >{{ currentWord.substring(wordPosIndex, currentWord.length) }}
      </span>
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
import Vue from "vue";
const allSentences = require("../assets/json/sentences.json");
// const allSentences = require("../assets/json/slowsentences.json");
// const allSentences = require("../assets/json/harrypotter.json");

const textCursors = ["|", " "];
let acceptableChars = Array.from(new Array(26), (x, i) => i + 65)
  .concat(Array.from(new Array(9), (x, i) => i + 49))
  .concat(40, 188, 190);

export default {
  name: "English",
  data() {
    return {
      msg: "",
      typed: "",
      notYetTyped: "",
      sentence: "",
      blurrySentences: "",
      onScreen: "",
      currentWord: "",
      words: "",
      wordPosIndex: 0,
      mistypeCounter: 0,
      startTime: 0,
      endTime: 0,
      counter: 0,
      wpm: 0,
      cpm: 0,
      firstCycle: true,
      mistype: false,
      typingSoundBool: false,
      sentenceStock: [],
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
              this.addCharToMsg("'");
              break;
          }
        }
        if (this.typingSoundBool) {
          this.randomClick();
        }
        //backspace
        if (e.keyCode == 8) {
          this.msg = this.msg.slice(0, -1);
          if (this.wordPosIndex > 0) this.wordPosIndex--;
        }
        //normal chars
        if (acceptableChars.includes(e.keyCode)) {
          let inputtedChar = String.fromCharCode(e.keyCode);
          this.addCharToMsg(inputtedChar);
        }
        //space
        if (e.keyCode === 32) {
          this.update();
        }
      }.bind(this)
    );
  },

  methods: {
    addCharToMsg(inputtedChar) {
      if (this.wordPosIndex < this.words[this.counter].length) {
        this.mistype = !(
          this.words[this.counter][this.wordPosIndex].toLowerCase() ==
          inputtedChar.toLowerCase()
        );
        if (!this.mistype) {
          this.msg += inputtedChar;
          this.wordPosIndex++;
        } else {
          this.mistypeCounter++;
        }
      }
    },
    getSentence() {
      return allSentences[Math.floor(Math.random() * allSentences.length)];
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

      while (this.sentenceStock.length < 5) {
        let tempSentence = this.getSentence();
        if (
          tempSentence != this.sentenceStock[this.sentenceStock.length - 1] ||
          this.sentenceStock.length == 0
        ) {
          this.sentenceStock.push(tempSentence);
        }
      }
      this.sentence = this.sentenceStock.shift();
      this.blurrySentences = this.sentenceStock.join("\n");
      this.notYetTyped = this.sentence
        .split(" ")
        .splice(1, this.sentence.length)
        .join(" ");
      this.words = this.sentence.split(" ");
      this.currentWord = this.sentence.split(" ")[0];
    },

    update() {
      //init
      let words = this.sentence.split(" ");

      if (this.startTime == 0) {
        this.startTime = new Date().getTime();
      }

      if (
        !this.firstCycle &&
        this.msg.replace(/\s+/g, "").toLowerCase() ===
          words[this.counter].toLowerCase()
      ) {
        this.wordPosIndex = 0;
        this.msg = this.msg.replace(/\s+/g, "");
        this.typed += words[this.counter] + " ";
        this.notYetTyped = this.notYetTyped
          .split(" ")
          .splice(1, this.sentence.split(" ").length)
          .join(" ");

        this.counter += 1;
        this.currentWord = this.sentence.split(" ")[this.counter];

        //reach end of sentence
        if (this.counter >= words.length) {
          this.endTime = new Date().getTime();
          words.length;
          this.wpm = (
            Math.round(
              (words.length / ((this.endTime - this.startTime) * 1.66667e-5)) *
                10
            ) / 10
          ).toFixed(1);
          this.cpm = (
            Math.round(
              (words.toString().length /
                ((this.endTime - this.startTime) * 1.66667e-5)) *
                10
            ) / 10
          ).toFixed(1);
          this.initialize();
          this.counter = 0;
        }
        this.msg = "";
      }

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

Vue.component("button-counter", {
  data: function () {
    return {
      count: 0,
    };
  },
  template:
    '<button v-on:click="count++">You clicked me {{ count }} times.</button>',
});
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
