<template>
  <div class="test-text">
    <span class="sentence">
      <!-- <font-awesome-icon :icon="['fab', 'font-awesome']" /> -->
      <span class="typed">{{ typed }}</span>
      <span class="notYetTyped">{{ notYetTyped }}</span>
      <font-awesome-icon icon="faVolumeDown" />
      <i class="fas fa-volume-down"></i>
    </span>
    <br />
    <p>press space to start</p>
    <p>
      <span class="wpm">wpm: {{ wpm }}</span>
    </p>
  </div>
</template>

<script>
import Vue from "vue";

// import fontawesome from "@fortawesome/fontawesome";
// import brands from "@fortawesome/fontawesome-free-brands";
// // import 1 icon if you just need this one. Otherwise you can import the whole module
// import faSpinner from "@fortawesome/fontawesome-free-solid/faSpinner";
// import FontAwesomeIcon from "@fortawesome/vue-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faFontAwesome } from "@fortawesome/free-brands-svg-icons";
// import faVolumeDown from "@fortawesome/free-solid-svg-icons/faVolumeDown";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faFontAwesome);

export default {
  name: "HelloWorld",
  data() {
    return {
      typingSoundBool: true,
      msg: "",
      typed: "",
      notYetTyped: "",
      sentence: "The quick brown fox",
      onScreen: "",
      nextWord: "",
      lastWord: "",
      startTime: null,
      endTime: null,
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
      this.notYetTyped = this.sentence;
      let words = this.sentence.split(" ");
      this.nextWord = "next:" + words[this.counter];
      this.firstCycle = false;
      this.msg = "";
      this.update();
      this.startTime = new Date().getTime();
    },
    update() {
      let words = this.sentence.split(" ");
      if (this.firstCycle) {
        this.initialize();
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
          this.counter = 0;
          this.notYetTyped = this.sentence;
          this.typed = "";
          this.endTime = new Date().getTime();
          //check for rounding
          //covert minutes and seconds to minute decimal
          words.length;
          this.wpm = (
            Math.round(
              (words.length / ((this.endTime - this.startTime) * 1.66667e-5)) *
                10
            ) / 10
          ).toFixed(1);
          console.log(words.length);
        }
      }
      this.msg = "";
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
.mainIn {
  color: rgb(32, 41, 41);
  font-size: 100%;
  /* visibility:hidden; */
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
</style>
