<template>
  <div id="landing-page">
    <div class="vertical-center">
      <VenueLogo />
      <!-- <img alt="Venue Logo" src="../assets/venue-logo.svg" /> -->
      <div>
        <h1>venue</h1>
      </div>
      <div>
        <router-link :to="{ path: '/signup' }"><button id="signup-btn">Sign up</button></router-link>
        or
        <router-link :to="{ path: '/login' }">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import VenueLogo from "../components/VenueLogo";
export default {
  name: "Landing",
  components: {
    VenueLogo
  }
};
</script>

<style scoped>
.venue-logo {
  max-width: 100%;
  width: 28rem;
}
#landing-page {
  text-align: center;
}
h1 {
  font-family: "Exo 2";
  font-size: calc(8vw + 3rem);
  padding: 0;
  margin: 0;
}
.vertical-center {
  width: 100%;
}
#signup-btn {
  padding: 1rem 1.5rem;
}
</style>
