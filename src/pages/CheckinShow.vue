<template>
  <div>
    <vue-qr :text="current" :size="200"></vue-qr>
  </div>
</template>

<script>
export default {
  data() {
    return {
      claimed: [],
      current: ""
    };
  },
  created() {
    this.current = this.generateQR();
  },
  methods: {
    generateQR() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 64; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }
  }
};
</script>
