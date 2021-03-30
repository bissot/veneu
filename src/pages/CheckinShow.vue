<template>
  <div class="row full-height justify-center q-px-xl q-pt-xl text-primary">
    <q-responsive :ratio="1" class="neu-convex" style="width: 50vh; max-width: 100%;">
      <vue-qr
        :key="current.code"
        :text="getBaseUrl() + '/checkin/' + current.code + '/scan'"
        :size="512"
        backgroundColor="#dfdfdf"
        colorLight="#dfdfdf"
        colorDark="#1a4974"
        :margin="8"
        :style="{ height: '100%', width: '100%' }"
        class="q-pa-md"
      />
    </q-responsive>
    <div v-if="$q.platform.is.mobile" id="seats" class="row full-width justify-center q-mt-lg">
      <q-icon size="sm" color="primary" name="event_seat" /> x{{ claimed.length }}
    </div>
    <div v-else id="seats" class="row full-width justify-center">
      <div class="row full-width justify-center q-mt-lg">
        <p>{{ claimed.length }} seats claimed</p>
      </div>
      <q-icon
        size="lg"
        color="primary"
        name="event_seat"
        v-for="claim in claimed"
        :key="claim.code"
        :title="claim.first_name + ' ' + claim.last_name"
      />
    </div>
    <ApolloSubscribeToMore
      :document="
        gql =>
          gql`
            subscription claimedTicket($code: String!) {
              claimedTicket(code: $code) {
                code
                user
                first_name
                last_name
              }
            }
          `
      "
      :variables="{ code: current.code }"
      :updateQuery="onClaimed"
    />
  </div>
</template>

<script>
import VueQr from "vue-qr";
import gql from "graphql-tag";
export default {
  components: { VueQr },
  data() {
    return {
      claimed: [],
      current: this.generateTicket(),
      next: this.generateTicket()
    };
  },
  methods: {
    getBaseUrl() {
      var getUrl = window.location;
      return getUrl.protocol + "//" + getUrl.host;
    },
    onClaimed(
      previousResult,
      {
        subscriptionData: {
          data: { claimedTicket }
        }
      }
    ) {
      this.current = this.next; // iteration logic
      this.next = this.generateTicket();
      this.sendApprove(claimedTicket);
      this.$q.notify({
        progress: true,
        message: claimedTicket.first_name + " " + claimedTicket.last_name + " checked in",
        icon: "event_seat",
        color: "primary"
      });
      this.claimed.push(claimedTicket);
    },
    generateTicket() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return {
        code: result
      };
    },
    async sendApprove(ticket) {
      this.$apollo.mutate({
        mutation: gql`
          mutation approveTicket($code: String!, $user: ID!, $first_name: String!, $last_name: String!) {
            approveTicket(code: $code, user: $user, first_name: $first_name, last_name: $last_name) {
              code
              user
              first_name
              last_name
            }
          }
        `,
        variables: ticket
      });
    }
  }
};
</script>
