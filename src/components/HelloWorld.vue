<template>
  <div class="test-text">
    <p>
      <span class="wpm">wpm: {{ wpm }}</span>
    </p>
    <span class="sentence">
      <span class="typed">{{ typed }}</span>
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
let allSentences = require("raw-loader!@/assets/sentences.txt").default.split(
  "\n"
);

export default {
  name: "HelloWorld",
  data() {
    return {
      typingSoundBool: false,
      msg: "",
      typed: "",
      notYetTyped: "",
      sentence: "",
      sentenceStock: [],
      blurrySentences: "",
      onScreen: "",
      nextWord: "",
      lastWord: "",
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
        if (this.typingSoundBool) {
          this.randomClick();
        }
        if (e.keyCode == 8) {
          this.msg = this.msg.slice(0, -1);
        }
        if (64 < e.keyCode && e.keyCode < 91) {
          this.msg += String.fromCharCode(e.keyCode);
        }
        if (e.keyCode === 32) {
          this.update();
        }
      }.bind(this)
    );
  },
  methods: {
    getSentence() {
      return allSentences[Math.floor(Math.random() * allSentences.length)];
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
    clear() {
      this.msg = null;
    },
    initialize() {
      this.counter = 0;
      while (this.sentenceStock.length < 5) {
        let tempSentence = this.getSentence();
        console.log(tempSentence);
        if (
          tempSentence != this.sentenceStock[this.sentenceStock.length - 1] ||
          this.sentenceStock.length == 0
        ) {
          this.sentenceStock.push(tempSentence);
        }
      }
      this.sentence = this.sentenceStock.shift();
      this.blurrySentences = this.sentenceStock.join("\n");
      console.log(this.sentenceStock);
      this.notYetTyped = this.sentence;
      let words = this.sentence.split(" ");
      this.nextWord = "next:" + words[this.counter];
      this.firstCycle = false;
      this.msg = "";
      this.typed = "";
      this.update();
      this.notYetTyped = this.sentence;
      this.startTime = 0;
      this.endTime = 0;
    },
    update() {
      let words = this.sentence.split(" ");
      if (this.startTime == 0) {
        this.startTime = new Date().getTime();
      }
      if (
        !this.firstCycle &&
        this.msg.replace(/\s+/g, "").toLowerCase() ===
          words[this.counter].toLowerCase()
      ) {
        this.nextWord = "next:" + words[this.counter + 1];
        this.msg = this.msg.replace(/\s+/g, "");
        this.typed += words[this.counter] + " ";
        this.notYetTyped = this.notYetTyped
          .split(" ")
          .splice(1, this.sentence.split(" ").length)
          .join(" ");
        this.counter += 1;
        if (this.counter >= words.length) {
          this.endTime = new Date().getTime();
          words.length;
          this.wpm = (
            Math.round(
              (words.length / ((this.endTime - this.startTime) * 1.66667e-5)) *
                10
            ) / 10
          ).toFixed(1);
          this.initialize();
          this.counter = 0;
        }
      }
      this.msg = "";
      if (this.firstCycle) {
        this.initialize();
      }
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
  color: rgb(0, 0, 0);
}
.notyet {
  /* color: rgb(202, 39, 39); */
}
.button {
  font-family: "Font Awesome 5 Free", sans-serif;
  font-weight: 900; /* Needed for font awesome to work... */
}
.blurrySentences {
  color: transparent;
  text-shadow: 0 0 4px rgb(185, 185, 185);
}
</style>
