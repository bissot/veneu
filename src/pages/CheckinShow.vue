<template>
  <q-page class="q-pa-md row justify-center">
    <q-responsive class="neu-convex" style="width: 50vh; height: 50vh;" :ratio="1">
      <vue-qr
        :key="current.code"
        :text="getBaseUrl() + '/checkin/scan?host=' + me._id + '&code=' + current.code"
        :size="512"
        backgroundColor="#dfdfdf"
        colorLight="#dfdfdf"
        colorDark="#1a4974"
        :margin="8"
        :style="{ height: '100%', width: '100%' }"
        class="q-pa-md"
      />
    </q-responsive>
    <div v-if="$q.platform.is.mobile" id="seats" class="row full-width justify-center q-mt-md">
      <q-icon size="sm" color="primary" name="event_seat" /> x{{ Object.keys(tickets).length - 1 }}
    </div>
    <div v-else id="seats" class="row full-width justify-center">
      <div class="row full-width justify-center q-mt-md">
        <p>{{ Object.keys(tickets).length - 1 }} seats claimed</p>
      </div>
      <div id="seatsiconscroll">
        <div
          class="seatindicator q-pa-xs"
          v-for="ticket in tickets"
          :key="ticket.code"
          :title="ticket.first_name + ' ' + ticket.last_name"
          :style="{ display: ticket.code == current.code ? 'none' : 'inline-block' }"
        >
          <div v-if="ticket.code != current.code">
            <q-icon size="lg" color="primary" name="event_seat" />
            <p>
              {{ ticket.first_name + " " + ticket.last_name }}
            </p>
          </div>
        </div>
      </div>
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
    <ApolloSubscribeToMore
      :document="
        gql =>
          gql`
            subscription reservedTicket($host: ID!) {
              reservedTicket(host: $host) {
                code
                user
                first_name
                last_name
              }
            }
          `
      "
      :variables="{ host: me._id }"
      :updateQuery="onReserved"
    />
  </q-page>
</template>

<script>
import VueQr from "vue-qr";
import gql from "graphql-tag";
export default {
  props: {
    me: Object
  },
  components: { VueQr },
  data() {
    return {
      tickets: {},
      current: this.generateTicket(),
      next: this.generateTicket()
    };
  },
  created() {
    this.tickets[this.current.code] = { ...this.current };
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
      this.tickets[this.current.code] = { ...this.current };
      this.tickets[claimedTicket.code] = { ...this.tickets[claimedTicket.code], ...claimedTicket };
      this.sendApprove(claimedTicket);
      this.$q.notify({
        progress: true,
        message: claimedTicket.first_name + " " + claimedTicket.last_name + " checked in",
        icon: "event_seat",
        color: "primary"
      });
    },
    onReserved(
      previousResult,
      {
        subscriptionData: {
          data: { reservedTicket }
        }
      }
    ) {
      const reservation_time = Date.now();
      if (
        reservedTicket.length == 5 &&
        Object.keys(this.tickets).length >= 5 &&
        reservedTicket.every(
          ticket =>
            undefined != this.tickets[ticket.code] && reservation_time - this.tickets[ticket.code].creation_time <= 5000
        )
      ) {
        this.$q.notify({
          progress: true,
          message: reservedTicket[0].first_name + " " + reservedTicket[0].last_name + " reserved their seat",
          icon: "event_seat",
          color: "primary"
        });
        const ticket = {
          ...this.generateTicket(),
          user: reservedTicket[0].user,
          first_name: reservedTicket[0].first_name,
          last_name: reservedTicket[0].last_name
        };
        this.sendApprove(ticket);
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
        code: result,
        creation_time: Date.now()
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

<style scoped>
.seatindicator {
  text-align: center;
}
#seatsiconscroll {
  overflow-y: auto;
  max-height: 20rem;
}
</style>
