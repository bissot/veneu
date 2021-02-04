<template>
  <div id="landing-page">
    <div class="vertical-center spinner-stage">
      <VenueLogo class="spinner" />
      <!-- <img alt="Venue Logo" src="../assets/venue-logo.svg" /> -->
      <div>
        <h1>venue</h1>
      </div>
      <q-bar id="landing-actions" class="q-gutter-x-md q-pa-sm q-ma-sm q-mt-xl justify-center">
        <q-btn dense color="primary" class="q-pa-sm" @click="handleGoSignup">
          <q-icon left size="2rem" name="person_add_alt" />
          <div>Sign Up</div>
        </q-btn>
        <div>or</div>
        <q-btn dense flat color="primary" class="q-pa-sm q-ma-none" @click="handleGoLogin">
          <q-icon left size="2rem" name="login" />
          <div>Log in</div>
        </q-btn>
      </q-bar>
    </div>
  </div>
</template>

<script>
import VenueLogo from "../components/VenueLogo";
export default {
  name: "Landing",
  components: {
    VenueLogo
  },
  methods: {
    handleGoLogin() {
      this.$router.push({ name: "Login" });
    },
    handleGoSignup() {
      this.$router.push({ name: "Signup" });
    }
  }
};
</script>

<style scoped>
#landing-page {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
h1 {
  font-family: "Exo 2";
  /* font-size: calc(8vw + 3rem); */
  padding: 0;
  margin: 0;
}
.spinner {
  width: 14rem;
  margin: auto;
}
</style>
