<template>
  <div id="landing-page" class="container">
    <div class="vertical-center">
      <img alt="Venue Logo" src="../assets/venue-logo.svg" />
      <div>
        <h1>venue</h1>
      </div>
      <div>SIGNUP</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Landing"
};
</script>

<style scoped>
img {
  width: 50%;
  max-width: 50rem;
}
#landing-page {
  width: 100%;
  max-width: 50rem;
  margin: auto;
  height: 100%;
  position: relative;
}
h1 {
  font-size: calc(8vw + 3rem);
  padding: 0;
  margin: 0;
}
.vertical-center {
  width: 100%;
}
</style>
