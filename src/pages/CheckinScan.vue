<template>
  <div class="vertical-center text-center q-pa-md">
    <q-btn
      v-if="$q.platform.is.desktop && !screen_scanning && !camera_scanning"
      class="q-ma-md"
      @click="handleStartScreenScan()"
      icon="monitor"
      icon-right="qr_code_scanner"
      size="xl"
      label="Screen Scan"
    />
    <q-btn
      v-else-if="screen_scanning"
      class="q-ma-md"
      @click="handleStopScreenScan()"
      icon-right="stop"
      size="xl"
      label="Stop"
    />
    <q-btn
      v-if="has_camera && !screen_scanning && !camera_scanning"
      class="q-ma-md"
      @click="handleStartCamScan()"
      icon="photo_camera"
      icon-right="qr_code_scanner"
      size="xl"
      label="Camera Scan"
    />
    <q-btn
      v-else-if="camera_scanning"
      class="q-ma-md"
      @click="handleStopCamScan()"
      icon-right="stop"
      size="xl"
      label="Stop"
    />
    <video v-if="screen_stream" id="captured-screen" autoplay :style="{ display: 'none' }"></video>
    <video
      v-if="camera_scanning"
      id="camera-video"
      autoplay
      :style="{ display: 'inline-block', maxWidth: '100%' }"
      class="q-pa-md neu-convex"
    ></video>
    <ApolloSubscribeToMore
      v-if="user"
      :document="
        gql =>
          gql`
            subscription approvedTicket($user: ID!) {
              approvedTicket(user: $user) {
                code
                user
              }
            }
          `
      "
      :variables="{ user }"
      :updateQuery="onApproved"
    />
  </div>
</template>

<script>
import QrScanner from "qr-scanner";
QrScanner.WORKER_PATH = "../../qr-scanner-worker.min.js";
import gql from "graphql-tag";
export default {
  props: {
    me: Object
  },
  data() {
    return {
      code: "",
      screen_scanning: false,
      screen_stream: null,
      screen_scanner: null,
      canvas: null,
      last: "",
      has_camera: false,
      camera_scanning: false,
      camera_scanner: null,
      user: null
    };
  },
  created() {
    if (this.me) {
      this.user = this.me._id;
    } else {
      this.user = this.generateID();
    }
    var self = this;
    QrScanner.hasCamera().then(res => {
      self.has_camera = true;
    });
  },
  methods: {
    generateID() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    handleDecodeQR(result) {
      let found = result.split("/")[4];
      this.sendClaim(found);
    },
    handleStartCamScan() {
      this.camera_scanning = true;
      let self = this;
      this.$nextTick(() => {
        var video = document.getElementById("camera-video");
        self.camera_scanner = new QrScanner(video, result => this.handleDecodeQR(result));
        self.camera_scanner.start();
      });
    },
    handleStopCamScan() {
      this.camera_scanning = false;
      this.camera_scanner.stop();
      this.camera_scanner.destroy();
      this.camera_scanner = null;
    },
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
                      .then(result => self.handleDecodeQR(result))
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
    },
    async sendClaim(code) {
      this.$apollo.mutate({
        mutation: gql`
          mutation claimTicket($code: String!, $user: ID!) {
            claimTicket(code: $code, user: $user) {
              code
              user
            }
          }
        `,
        variables: {
          code,
          user: this.user
        }
      });
    },
    onApproved(
      previousResult,
      {
        subscriptionData: {
          data: { approvedTicket }
        }
      }
    ) {
      if (this.screen_scanning) {
        this.handleStopScreenScan();
      } else if (this.camera_scanning) {
        this.handleStopCamScan();
      }
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
