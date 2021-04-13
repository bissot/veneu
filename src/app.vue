<template>
  <q-layout id="app" view="lhr Lpr lfr" class="text-primary">
    <q-ajax-bar position="top" color="primary" size="0.25rem" />
    <ApolloQuery :query="require('./graphql/Me.gql')">
      <template slot-scope="{ result: { data, error } }">
        <div v-if="error">{{ tryLogout() }}</div>
        <div v-if="data">
          <q-header class="text-primary">
            <q-pull-to-refresh @refresh="refresh" color="white" bg-color="primary">
              <q-toolbar class="q-pt-md">
                <q-btn
                  v-if="data.me"
                  round
                  size="sm"
                  icon="menu"
                  class="q-mx-sm"
                  title="Menu"
                  aria-label="Menu"
                  @click="left = !left"
                />
                <q-toolbar-title v-if="!['Landing', 'Login', 'Signup', 'FirstTimeLogin'].includes($route.name)">
                  <q-avatar @click="$router.push({ name: 'Dashboard' })">
                    <VenueLogo id="nav-logo" />
                  </q-avatar>
                </q-toolbar-title>

                <q-space />

                <q-btn size="sm" round icon="qr_code_2" class="q-mx-sm" title="Checkin" aria-label="Checkin">
                  <q-menu :offset="[50, 16]">
                    <div class="q-pa-xs">
                      <q-item clickable class="row full-width items-center q-ma-none" @click="handleScan"
                        ><q-icon color="primary" size="sm" name="qr_code_scanner" class="q-mr-sm" />Attend</q-item
                      >
                      <q-item clickable class="row full-width items-center q-ma-none" @click="handleHost"
                        ><q-icon color="primary" size="sm" name="present_to_all" class="q-mr-sm" />Host</q-item
                      >
                    </div>
                  </q-menu>
                </q-btn>
                <q-btn v-if="data.me" size="sm" round icon="notifications" class="q-mx-sm" title="API" aria-label="API">
                  <q-badge rounded color="red" floating label="1+" />
                </q-btn>
              </q-toolbar>
            </q-pull-to-refresh>
          </q-header>

          <q-drawer v-if="data.me" show-if-above v-model="left" side="left">
            <q-input borderless v-model="searchString" label="Search..." class="q-ml-md q-mr-md">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append v-if="searchString">
                <q-icon name="close" @click="searchString = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-item clickable class="rounded-borders" id="me">
              <q-item-section avatar>
                <q-avatar class="spinner">
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ data.me.first_name }} {{ data.me.last_name }}</q-item-label>
                <q-item-label caption>{{ data.me.email }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  flat
                  size="sm"
                  round
                  icon="logout"
                  class="q-mx-sm text-primary"
                  title="Logout"
                  aria-label="Logout"
                  @click="confirmLogout = true"
                />
                <q-dialog v-model="confirmLogout">
                  <q-card class="q-pa-sm">
                    <q-card-section>
                      <span class="text-primary">Are you sure? We'd hate to see you leave...</span>
                    </q-card-section>

                    <q-card-actions>
                      <q-btn flat label="Cancel" color="primary" v-close-popup />
                      <q-space />
                      <q-btn
                        flat
                        label="Logout"
                        class="bg-primary text-white"
                        v-close-popup
                        @click="tryLogout"
                        icon-right="meeting_room"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-item-section>
            </q-item>
            <q-list class="text-primary neu-convex q-mx-md q-my-md q-mb-lg q-pa-xs">
              <course-list :me="data.me" />
            </q-list>
            <q-list class="text-primary neu-convex q-mx-md q-my-lg q-pa-xs">
              <q-expansion-item
                expand-separator
                icon="qr_code_2"
                label="Check-ins"
                expand-icon-class="text-primary"
                :header-inset-level="0"
                :content-inset-level="0.5"
              >
                <q-list class="rounded-borders">
                  <q-expansion-item
                    expand-separator
                    icon="present_to_all"
                    label="Hosted"
                    :header-inset-level="0"
                    :content-inset-level="0"
                    expand-icon-class="text-primary"
                  >
                    <ApolloQuery :query="require('./graphql/Checkins.gql')">
                      <template slot-scope="{ result: { loading, error, data } }">
                        <div v-if="error">Error...</div>
                        <div v-else-if="loading">Loading...</div>
                        <q-list v-else-if="data">
                          <q-item
                            class="row items-center justify-center"
                            clickable
                            v-for="checkin in data.checkins"
                            :key="checkin._id"
                            @click="handleHosted(checkin._id)"
                          >
                            {{ checkin.created_at }}
                          </q-item>
                        </q-list>
                        <q-item v-else class="row items-center justify-center" clickable>
                          None
                        </q-item>
                      </template>
                    </ApolloQuery>
                  </q-expansion-item>

                  <q-expansion-item
                    expand-separator
                    icon="qr_code_scanner"
                    label="Attended"
                    :content-inset-level="0"
                    expand-icon-class="text-primary"
                  >
                    <q-card>
                      <q-card-section>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos
                        corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto
                        suscipit iste eveniet doloribus ullam aliquid.
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-expansion-item>
            </q-list>
            <q-list class="text-primary neu-convex q-mx-md q-my-md q-pa-xs">
              <q-expansion-item
                expand-separator
                icon="assignment"
                label="Assignments"
                expand-icon-class="text-primary"
                :content-inset-level="0.5"
              >
                <q-list class="rounded-borders">
                  <q-expansion-item
                    expand-separator
                    icon="assignment_late"
                    label="Due"
                    :content-inset-level="0"
                    expand-icon-class="text-primary"
                  >
                    <q-card>
                      <q-card-section>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos
                        corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto
                        suscipit iste eveniet doloribus ullam aliquid.
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item
                    expand-separator
                    icon="assignment_turned_in"
                    label="Complete"
                    :content-inset-level="0"
                    expand-icon-class="text-primary"
                  >
                    <q-card>
                      <q-card-section>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos
                        corrupti commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto
                        suscipit iste eveniet doloribus ullam aliquid.
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </q-expansion-item>
            </q-list>
          </q-drawer>

          <q-page-container class="text-primary">
            <router-view :me="data.me" />
          </q-page-container>
        </div>
      </template>
    </ApolloQuery>
  </q-layout>
</template>

<script>
import gql from "graphql-tag";
import VenueLogo from "./components/VenueLogo";
import CourseList from "./components/CourseList";
import "quasar/icon-set/fontawesome-v5";
import "./assets/venue.css";
export default {
  name: "app",
  components: {
    VenueLogo,
    CourseList
  },
  data() {
    return {
      left: false,
      searchString: "",
      confirmLogout: false
    };
  },
  methods: {
    handleDonate() {
      var win = window.open(
        "https://www.paypal.com/donate/?cmd=_donations&business=ejwhitton43%40gmail.com&currency_code=USD",
        "_blank"
      );
      win.focus();
    },
    handleAPI() {
      var win = window.open(process.env.BASE_URL + "graphql", "_blank");
      win.focus();
    },
    handleScan() {
      this.$router.push({ name: "CheckinScan" });
    },
    generateID() {
      var result = "";
      var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 24; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    handleHost() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation createCheckin {
              createCheckin {
                _id
              }
            }
          `
        })
        .then(({ data }) => {
          this.$router.push({ name: "CheckinShow", params: { _id: data.createCheckin._id } });
        })
        .catch(e => {
          this.$q.notify({
            progress: true,
            message: "Issue creating a checkin, try again " + e,
            icon: "error",
            color: "negative"
          });
        });
    },
    handleHosted(_id) {
      this.$router.push({ name: "CheckinShow", params: { _id } });
    },
    tryLogout() {
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        location.reload();
      }
    },
    refresh(on) {
      location.reload();
    }
  }
};
</script>

<style></style>
