<template>
  <div id="voyager-page"></div>
</template>

<script>
export default {
  name: "Voyager",
  created() {},
  mounted() {
    var element = document.getElementById("voyager");
    document.getElementById("voyager-page").appendChild(element);
  }
};
</script>

<style scoped>
#voyager-page {
  height: 100%;
  width: 100%;
}
.viewport {
  border: 0.1rem solid black !important;
}
</style>
