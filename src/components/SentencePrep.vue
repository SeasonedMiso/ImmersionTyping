<template>
  <div>
    <button v-on:click="kanjiToKana">MakeJson</button>
  </div>
</template>

<script lang="ts">
// import Vue from "vue";
const content = require("../assets/json/PrepreppedJapaneseCopyright.json");

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
          sentence: [],
          kana: [],
        });
        console.log();
        let splitSentence = lines[i].split(" ");

        splitSentence = splitSentence.filter(function (el) {
          return el.length != 0;
        });
        let kanaSent = "";

        //Kanji sentence
        let sentenceKanji = lines[i].replaceAll(/ *\[[^\]]*]/g, "").split(" ");
        writeObject.sentences[i].sentence = sentenceKanji;

        //kana sentence
        for (var word in splitSentence) {
          let temp;
          if (splitSentence[word].includes("[")) {
            if (!/([一-龯])/.test(splitSentence[word])) {
              if (splitSentence[word].includes("[")) {
                temp = splitSentence[word].replace(/ *\[[^\]]*]/, "");
                console.log(temp);
              } else {
                temp = splitSentence[word];
              }
            } else {
              if (!splitSentence[word].includes(",")) {
                temp =
                  splitSentence[word].split("[")[1].split("]")[0] +
                  splitSentence[word].split("]")[1];
              } else {
                temp =
                  splitSentence[word].split("[")[1].split(",")[0] +
                  splitSentence[word].split("]")[1];
              }
            }
            console.log(splitSentence[word]);
            console.log(temp);
            kanaSent += temp + ",";
          } else {
            kanaSent += splitSentence[word] + ",";
          }
        }

        kanaSent = kanaSent.slice(0, kanaSent.length - 1);
        let kana = kanaSent.split(",");
        console.log("kana: " + kana);
        console.log("kanji: " + sentenceKanji);

        writeObject.sentences[i].kana = kana;
      }
      console.log(writeObject);
      let json = JSON.stringify(writeObject);
      console.log(json);

      function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      }
      download(json, "test.json", "text/plain");
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
