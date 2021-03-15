<template>
  <div>
    <div id="seats">
      <!-- <q-icon size="xl" color="primary" name="event_seat" v-for="claim in current" :key="claim.code"></q-icon> -->
    </div>
    <vue-qr
      v-for="(ticket, i) in tickets"
      :key="ticket.code"
      :text="getBaseUrl() + '/checkin/' + ticket.code + '/scan'"
      :size="1024"
      backgroundColor="#dfdfdf"
      colorLight="#dfdfdf"
      colorDark="#1a4974"
      :margin="0"
      width="200"
      height="200"
      class="q-ma-md"
      :style="{ display: i != current ? 'none' : 'block' }"
    />
    {{ current }}
    <q-btn @click="current++">+1</q-btn>
    looking for {{ tickets[current].code }}
    <ApolloSubscribeToMore
      :document="
        gql =>
          gql`
            subscription claimedTicket($code: String!) {
              claimedTicket(code: $code)
            }
          `
      "
      :variables="{ code: tickets[current].code }"
      :updateQuery="onClaimed"
    />
  </div>
</template>

<script>
import VueQr from "vue-qr";
export default {
  components: { VueQr },
  data() {
    return {
      current: -1,
      tickets: []
    };
  },
  created() {
    for (let i = 0; i < 50; i++) {
      this.tickets.push(this.generateTicket());
    }
    this.current = 0;
  },
  methods: {
    getBaseUrl() {
      var getUrl = window.location;
      return getUrl.protocol + "//" + getUrl.host;
    },
    onClaimed(previousResult, { subscriptionData }) {
      console.log("received", subscriptionData.data.claimedTicket);
      if (subscriptionData.data.claimedTicket == this.tickets[this.current].code) {
        this.current++;
        if (this.current >= 50) location.reload();
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
