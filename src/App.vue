<template>
  <div id="app">
    <!-- <Navbar />
    <Runner />
    <Footer /> -->
    <HelloWorld/>
    <!-- <font-awesome-icon icon="user-secret"/> -->
  </div>
</template>

<script>
// import Runner from './components/Runner.vue'
// import Navbar from './components/Navbar.vue'
// import Footer from './components/Footer.vue'


import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
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
