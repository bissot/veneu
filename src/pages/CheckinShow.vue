<template>
  <div>
    <vue-qr :text="current" :size="200"></vue-qr>
    <q-btn class="q-mx-md" @click="claim()">Claim</q-btn>
  </div>
</template>

<script>
import VueQr from "vue-qr";
export default {
  components: { VueQr },
  data() {
    return {
      claimed: [],
      current: ""
    };
  },
  created() {
    this.generateQR();
  },
  methods: {
    claim() {
      this.generateQR();
    },
    generateQR() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 64; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      this.current = result;
    }
  }
};
</script>
