<template>
  <div>
    <div id="seats">
      <q-icon size="xl" color="primary" name="event_seat" v-for="claim in claimed" :key="claim.code"></q-icon>
    </div>
    <vue-qr
      v-if="current"
      :text="getBaseUrl() + '/checkin/' + current.code + '/scan'"
      :size="1024"
      backgroundColor="#dfdfdf"
      colorLight="#dfdfdf"
      colorDark="#1a4974"
      :margin="0"
      width="200"
      height="200"
      class="q-ma-md"
    ></vue-qr>
    <ApolloMutation
      :mutation="
        gql => gql`
          mutation approveTicket($code: String!) {
            approveTicket(code: $code)
          }
        `
      "
      :variables="{ code: current.code }"
    >
      <template v-slot="{ mutate, loading, error }">
        looking for {{ code }}
        <ApolloSubscribeToMore
          :document="
            gql =>
              gql`
                subscription claimedTicket($code: String!) {
                  claimedTicket(code: $code)
                }
              `
          "
          :variables="{ code }"
          :updateQuery="onClaimed"
        />
        <p v-if="error">An error occurred: {{ error }}</p>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
import VueQr from "vue-qr";
export default {
  components: { VueQr },
  data() {
    return {
      claimed: [],
      current: {},
      next: {},
      code: ""
    };
  },
  created() {
    this.current = this.generateTicket();
    this.next = this.generateTicket();
    this.code = this.current.code;
  },
  methods: {
    getBaseUrl() {
      var getUrl = window.location;
      return getUrl.protocol + "//" + getUrl.host;
    },
    onClaimed(previousResult, { subscriptionData }) {
      console.log("received", subscriptionData.data.claimedTicket);
      if (subscriptionData.data.claimedTicket == this.current.code) {
        this.claimed.push(this.current);
        this.code = this.next.code;
        this.current = this.next;
        this.next = this.generateTicket();
      }
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
    }
  }
};
</script>
