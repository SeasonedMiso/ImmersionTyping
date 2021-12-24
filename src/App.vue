<template>
  <div id="app">
    <!-- <Navbar />
    <Runner />
    <Footer /> -->
    <!-- <English/> -->
    <Japanese />
    <sentencePrep />
    <!-- <font-awesome-icon icon="user-secret"/> -->
  </div>
</template>

<script>
// import Runner from './components/Runner.vue'
// import Navbar from './components/Navbar.vue'
// import Footer from './components/Footer.vue'

// import English from "./components/English.vue";
import Japanese from "./components/Japanese.vue";
import SentencePrep from "./components/SentencePrep.vue";

export default {
  name: "App",
  components: {
    // English,
    Japanese,
    SentencePrep,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
