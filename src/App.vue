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
        <q-btn
          flat
          size="sm"
          round
          icon="logout"
          class="q-mx-sm"
          title="Logout"
          aria-label="Logout"
          @click="confirmLogout = true"
        />
        <q-dialog v-model="confirmLogout" persistent>
          <q-card>
            <q-card-section class="row items-center">
              <!-- <q-avatar icon="meeting_room" color="primary" text-color="white" /> -->
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
      <q-list class="text-primary neu-convex q-mx-lg q-mt-sm">
        <q-expansion-item
          expand-separator
          icon="school"
          label="ITWS Capstone"
          caption="ITWS 4100"
          expand-icon-class="text-primary"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="event_seat"
              label="Registration Section 01"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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
              icon="groups"
              label="Team 2"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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

        <q-expansion-item
          expand-separator
          icon="school"
          label="Database Systems"
          caption="CSCI 4380"
          expand-icon-class="text-primary"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="event_seat"
              label="Registration Section 01"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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
              icon="groups"
              label="Team 5"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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

        <q-expansion-item
          expand-separator
          icon="school"
          label="Web Science Systems Development"
          caption="ITWS 4500"
          expand-icon-class="text-primary"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="event_seat"
              label="Registration Section 02"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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
              icon="groups"
              label="Team 6"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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

      <!-- <q-separator spaced="1rem" /> -->

      <q-list class="text-primary neu-convex q-mx-lg q-mt-xl">
        <q-expansion-item expand-separator icon="assignment" label="Assignments" expand-icon-class="text-primary">
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="assignment_late"
              label="Due"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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
              :header-inset-level="0.25"
              :content-inset-level="0.25"
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

    <q-footer reveal elevated class="text-primary">
      <q-toolbar class="justify-around">
        <q-toolbar-title>
          Venue | About |
          <q-avatar size="sm">
            <img src="./assets/github.svg" />
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import VenueLogo from "./components/VenueLogo";
import "./assets/venue.css";
export default {
  name: "App",
  components: {
    VenueLogo
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
    }
  }
};
</script>

<style>
* {
  font-family: "Comfortaa", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* main { */
/* border-radius: 1rem 0rem 0rem 1rem; */
/* box-shadow: inset 0.5rem 0.5rem 0.5rem #bebebe, inset -0.5rem -0.5rem 0.5rem #f8f8f8; */
/* } */

#nav-logo {
  width: 100%;
}
</style>
