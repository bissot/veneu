<template>
  <div id="voyager-page"></div>
</template>

<script>
export default {
  name: "Voyager",
  created() {},
  mounted() {
    var element = document.getElementById("voyager");
    if (!element) location.reload();
    else document.getElementById("voyager-page").appendChild(element);
  }
};
</script>

<style>
#voyager-page {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
}

#voyager {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
}
</style>
