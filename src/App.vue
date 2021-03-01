<template>
  <q-layout id="app" view="lhr Lpr lfr">
    <q-header class="text-primary">
      <q-toolbar v-if="getAuth()">
        <q-btn flat round size="sm" icon="menu" class="q-mx-sm" title="Menu" aria-label="Menu" @click="left = !left" />

        <!-- <q-icon size="sm" flat round name="menu" @click="left = !left" /> -->
        <!-- <q-input borderless v-model="searchString" class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="searchString === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchString = ''" />
          </template>
        </q-input> -->
        <q-toolbar-title>
          <q-avatar @click="$router.push({ name: 'Dashboard' })">
            <VenueLogo id="nav-logo" />
          </q-avatar>
        </q-toolbar-title>

        <q-btn
          flat
          round
          size="sm"
          icon="insights"
          class="q-mx-sm"
          title="Voyager"
          aria-label="Voyager"
          @click="$router.push({ name: 'Voyager' })"
        />
        <q-btn
          flat
          size="sm"
          round
          icon="volunteer_activism"
          class="q-mx-sm"
          title="Donate"
          aria-label="Donate"
          @click="handleDonate"
        />
        <q-btn flat size="sm" round icon="api" class="q-mx-sm" title="API" aria-label="API" @click="handleAPI" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="getAuth()" show-if-above v-model="left" side="left">
      <q-input borderless v-model="searchString" label="Search..." class="q-ml-md q-mr-md">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="searchString">
          <q-icon name="close" @click="searchString = ''" class="cursor-pointer" />
        </template>
      </q-input>
      <ApolloQuery :query="require('./graphql/Me.gql')">
        <template slot-scope="{ result: { loading, error, data } }">
          <div v-if="loading">Loading...</div>
          <div v-if="error">Error...</div>
          <div v-if="data">
            <q-item clickable class="rounded-borders" id="me">
              <q-item-section avatar>
                <q-avatar>
                  <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ data.me.first_name }} {{ data.me.last_name }}</q-item-label>
                <q-item-label caption>
                  {{ data.me.email }}
                </q-item-label>
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
                        @click="handleLogout"
                        icon-right="meeting_room"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </q-item-section>
            </q-item>
          </div>
        </template>
      </ApolloQuery>

      <q-list class="text-primary neu-convex q-mx-md q-my-md q-mb-lg">
        <course-list />
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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                  commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                  eveniet doloribus ullam aliquid.
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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                  commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                  eveniet doloribus ullam aliquid.
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <q-footer reveal class="text-primary">
      <q-toolbar class="justify-center">
        Venue | About |
        <q-avatar size="sm" class="q-mx-sm">
          <img src="./assets/github.svg" />
        </q-avatar>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import VenueLogo from "./components/VenueLogo";
import CourseList from "./components/CourseList";
import "./assets/venue.css";
export default {
  name: "App",
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
    handleLogout() {
      localStorage.removeItem("token");
      location.reload();
    },
    getAuth() {
      return localStorage.getItem("token");
    },
    handleDonate() {
      var win = window.open(
        "https://www.paypal.com/donate/?cmd=_donations&business=ejwhitton43%40gmail.com&currency_code=USD",
        "_blank"
      );
      win.focus();
    },
    handleAPI() {
      var win = window.open("http://localhost:4000/graphql", "_blank");
      win.focus();
    }
  }
};
</script>

<style></style>
