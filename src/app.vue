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
                <q-toolbar-title v-if="!['Landing', 'Login', 'Signup'].includes($route.name)">
                  <q-avatar @click="$router.push({ name: 'Dashboard' })">
                    <VenueLogo id="nav-logo" />
                  </q-avatar>
                </q-toolbar-title>

                <q-space />

                <!-- <q-btn
                round
                size="sm"
                icon="insights"
                class="q-mx-sm"
                title="Voyager"
                aria-label="Voyager"
                @click="$router.push({ name: 'Voyager' })"
              />
              <q-btn
                size="sm"
                round
                icon="volunteer_activism"
                class="q-mx-sm"
                title="Donate"
                aria-label="Donate"
                @click="handleDonate"
              />
              <q-btn size="sm" round icon="api" class="q-mx-sm" title="API" aria-label="API" @click="handleAPI" />-->
                <q-btn
                  size="sm"
                  round
                  icon="qr_code_2"
                  class="q-mx-sm"
                  title="Scan"
                  aria-label="Scan"
                  @click="handleScan"
                />
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
                  <q-card>
                    <q-card-section class="row items-center">
                      <span class="q-ml-sm text-primary">Are you sure? We'd hate to see you leave...</span>
                    </q-card-section>

                    <q-card-actions align="around">
                      <q-btn flat label="Cancel" color="primary" v-close-popup />
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
            <q-list class="text-primary neu-convex q-mx-md q-my-md q-mb-lg">
              <course-list :me="data.me" />
            </q-list>
            <q-list class="text-primary neu-convex q-mx-md q-my-md">
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
      var win = window.open(process.env.BASE_URL + "/graphql", "_blank");
      win.focus();
    },
    handleScan() {
      this.$router.push({ name: "CheckinScan" });
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
