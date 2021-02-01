<template>
  <div id="app">
    <Navbar />
    <main id="main"><router-view></router-view></main>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import "./assets/venue.css";
export default {
  name: "App",
  components: {
    Navbar
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
* {
  font-family: "Comfortaa", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#app {
  text-align: center;
  position: absolute;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: var(--venue-light);
}
#main {
  position: absolute;
  top: 6rem;
  height: calc(100% - 6rem);
  width: 100%;
}
</style>
