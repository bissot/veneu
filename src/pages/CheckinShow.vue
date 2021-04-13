<template>
  <q-page class="q-pa-md">
    <div class="row full-width justify-center">
      <div class="neu-convex" style="width: 50vh; height: 50vh;">
        <vue-qr
          :key="current.code"
          :text="
            getBaseUrl() + '/checkin/scan?host=' + me._id + '&code=' + current.code + '&checkin=' + $route.params._id
          "
          :size="512"
          backgroundColor="#dfdfdf"
          colorLight="#dfdfdf"
          colorDark="#1a4974"
          :margin="8"
          :style="{ height: '100%', width: '100%' }"
          class="q-pa-md"
        />
      </div>
    </div>
    <div class="row full-width justify-center q-mt-xl">
      <div v-if="$q.platform.is.mobile">
        <p>
          <q-icon size="sm" color="primary" name="event_seat" /> x{{ Object.keys(tickets).length - 1 }}
          <q-btn
            v-if="Object.keys(tickets).length - 1 > 0"
            icon="download"
            class="q-ml-sm"
            title="Download Attendance CSV"
            @click="downloadCSV"
          />
        </p>
      </div>
      <div v-else>
        <div class="row full-width justify-center q-mt-md">
          <p>
            {{ Object.keys(tickets).length - 1 }} seats claimed
            <q-btn
              v-if="Object.keys(tickets).length - 1 > 0"
              icon="download"
              class="q-ml-sm"
              title="Download Attendance CSV"
              @click="downloadCSV"
            />
          </p>
        </div>
        <div id="seatsiconscroll" class="row full-width justify-center q-mt-md">
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
    </div>
    <div class="row full-width justify-center q-mt-xl">
      <q-btn label="Delete" size="md" icon-right="delete" class="bg-red text-white" @click="deleteModal = true" />
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
    <q-dialog v-model="deleteModal" persistent>
      <q-card class="q-pa-sm">
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="red" text-color="white" />
          <span class="q-ml-sm">Are you sure? This is <b>permanent</b>.</span>
        </q-card-section>

        <q-card-actions>
          <q-btn label="Cancel" class="text-primary" v-close-popup />
          <q-space />
          <q-btn label="Delete" color="white" class="bg-red" v-close-popup @click="handleDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      next: this.generateTicket(),
      deleteModal: false
    };
  },
  created() {
    this.tickets[this.current.code] = { ...this.current };
  },
  methods: {
    downloadCSV() {
      const csvContent =
        "data:text/csv;charset=utf-8,First,Last,User ID,Code\n" +
        Object.values(this.tickets)
          .map(e => e.user && [e.first_name, e.last_name, e.user, e.code].join(","))
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "attendance-" + this.$route.params._id + ".csv");
      document.body.appendChild(link);

      link.click();
    },
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
      this.sendApprove(this.tickets[claimedTicket.code]);
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
        this.sendApprove({
          ...this.generateTicket(),
          user: reservedTicket[0].user,
          first_name: reservedTicket[0].first_name,
          last_name: reservedTicket[0].last_name
        });
      }
    },
    generateTicket() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 24; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return {
        code: result,
        creation_time: Date.now(),
        checkin: this.$route.params._id
      };
    },
    async sendApprove(ticket) {
      this.$apollo.mutate({
        mutation: gql`
          mutation approveTicket($code: String!, $user: ID!, $first_name: String!, $last_name: String!, $checkin: ID!) {
            approveTicket(code: $code, user: $user, first_name: $first_name, last_name: $last_name, checkin: $checkin) {
              code
              user
              first_name
              last_name
            }
          }
        `,
        variables: ticket
      });
    },
    async handleDelete() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation deleteCheckin($_id: ID!) {
              deleteCheckin(_id: $_id) {
                _id
              }
            }
          `,
          variables: {
            _id: this.$route.params._id
          }
        })
        .then(({ data }) => {
          location.href = "/dashboard";
        })
        .catch(e => {
          this.$q.notify({
            progress: true,
            message: "Couldn't delete checkin",
            icon: "error",
            color: "negative"
          });
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
