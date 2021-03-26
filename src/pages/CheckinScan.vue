<template>
  <div class="vertical-center text-center">
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
    <q-btn
      v-if="$q.platform.is.desktop && !screen_scanning"
      class="q-ma-md"
      @click="handleStartScreenScan()"
      icon-right="qr_code_scanner"
      size="xl"
      label="Screen Scan"
    />
    <q-btn
      v-else-if="$q.platform.is.desktop"
      class="q-ma-md"
      @click="handleStopScreenScan()"
      icon-right="stop"
      size="xl"
      label="Stop"
    />
    <video v-if="screen_stream" id="captured-screen" autoplay :style="{ display: 'none' }"></video>
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
QrScanner.WORKER_PATH = "../../qr-scanner-worker.min.js";
import gql from "graphql-tag";
export default {
  data() {
    return {
      code: "",
      screen_scanning: false,
      screen_stream: null,
      screen_scanner: null,
      canvas: null,
      last: "",
      has_camera: false,
      camera_scanning: false
    };
  },
  created() {
    var self = this;
    QrScanner.hasCamera().then(res => {
      self.has_camera = true;
    });
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
                var video = document.getElementById("captured-screen");
                video.srcObject = self.screen_stream;
                self.screen_scanner = setInterval(function() {
                  //check for qrcode ...
                  if (self.screen_stream) {
                    const videoTrack = video.srcObject.getVideoTracks()[0];
                    const { height, width } = videoTrack.getSettings();
                    self.canvas.width = width;
                    self.canvas.height = height;
                    self.canvas.getContext("2d", { alpha: false }).drawImage(video, 0, 0, width, height);
                    QrScanner.scanImage(self.canvas)
                      .then(res => {
                        let found = res.split("/")[4];
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
                      })
                      .catch(error => {});
                  } else {
                    self.handleStopScreenScan();
                  }
                }, 200);
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

<style scoped>
.justify-center {
  position: absolute;
  height: 100%;
}
</style>
