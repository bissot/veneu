<template>
  <div>
    <ApolloSubscribeToMore
      :document="
        gql =>
          gql`
            subscription approvedTicket($code: String!) {
              approvedTicket(code: $code)
            }
          `
      "
      :variables="{ code }"
    />
    <q-input v-model="code" />
    <q-btn v-if="!screen_scanning" class="q-ma-md" @click="handleStartScreenScan()">Scan</q-btn>
    <q-btn v-else class="q-ma-md" @click="handleStopScreenScan()">Stop</q-btn>
    <video v-if="screen_stream" id="captured-screen" autoplay :style="{ display: 'none' }"></video>
  </div>
</template>

<script>
import jsQR from "jsqr";
import gql from "graphql-tag";
export default {
  data() {
    return {
      code: "",
      screen_scanning: false,
      screen_stream: null,
      screen_scanner: null,
      canvas: null
    };
  },
  methods: {
    handleStartScreenScan() {
      let self = this;
      if (navigator && navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then(res => {
            if (res) {
              self.screen_scanning = true;
              self.screen_stream = res;
              self.canvas = document.createElement("canvas");
              self.$nextTick(function() {
                let video = document.getElementById("captured-screen");
                video.srcObject = self.screen_stream;
                const videoTrack = video.srcObject.getVideoTracks()[0];
                self.screen_scanner = setInterval(function() {
                  //check for qrcode ...
                  if (self.screen_stream) {
                    const { height, width } = videoTrack.getSettings();
                    self.canvas.width = width;
                    self.canvas.height = height;
                    self.canvas.getContext("2d", { alpha: false }).drawImage(video, 0, 0, width, height);
                    const data = jsQR(
                      self.canvas.getContext("2d", { alpha: false }).getImageData(0, 0, width, height).data,
                      width,
                      height
                    );
                    if (data) {
                      let found = data.data.split("/")[4];
                      self.$apollo
                        .mutate({
                          mutation: gql`
                            mutation claimTicket($code: String!) {
                              claimTicket(code: $code)
                            }
                          `,
                          variables: {
                            code: found
                          }
                        })
                        .then(data => {});
                    }
                  } else {
                    self.handleStopScreenScan();
                  }
                }, 50);
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    handleStopScreenScan() {
      this.screen_scanning = false;
      clearInterval(this.screen_scanner);
      this.screen_stream.getTracks().forEach(track => track.stop());
      this.screen_stream = null;
      this.screen_scanner = null;
      this.canvas = null;
    }
  }
};
</script>
