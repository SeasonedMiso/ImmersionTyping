<template>
  <div>
    <button v-on:click="kanjiToKana">MakeJson</button>
  </div>
</template>

<script lang="ts">
// import Vue from "vue";
const content = require("../shortJapanese.json");

export default {
  name: "SentencePrep",

  data() {
    return {};
  },
  methods: {
    kanjiToKana() {
      let writeObject = {
        sentences: [],
      };
      let lines = content;
      for (var i in lines) {
        writeObject.sentences.push({
          sentence: "",
          kana: "",
        });
        let splitSentence = lines[i].split(" ");
        splitSentence = splitSentence.filter(function (el) {
          return el.length != 0;
        });
        let kanaSent = "";

        //Kanji sentence
        let sentenceKanji = lines[i]
          .replaceAll(/ *\[[^\]]*]/g, "")
          .replaceAll(" ", "");
        writeObject.sentences[i].sentence = sentenceKanji;

        //kana sentence
        for (var word in splitSentence) {
          let temp;
          if (splitSentence[word].includes("[")) {
            if (!/([一-龯])/.test(splitSentence[word])) {
              temp = splitSentence[word].split("]")[0].split("[")[0];
            } else {
              temp = splitSentence[word].split("]")[0].split("[")[1];
            }
            temp = splitSentence[word].split("[")[1].split("]")[0];
            kanaSent += temp;
          } else {
            kanaSent += splitSentence[word];
          }
        }
        console.log("kana: " + kanaSent);
        writeObject.sentences[i].kana = kanaSent;
      }
      console.log(writeObject);
      let json = JSON.stringify(writeObject);
      console.log(json);
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
</style>
