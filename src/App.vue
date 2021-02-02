<template>
  <q-layout id="app" view="lHr Lpr lfr">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-icon size="sm" flat name="menu" @click="left = !left" />

        <q-toolbar-title>
          <q-avatar>
            <img src="./assets/venue-logo.svg" />
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-list bordered class="rounded-borders">
        <q-expansion-item expand-separator icon="perm_identity" label="Account settings" caption="John Doe">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi
              magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus
              ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="signal_wifi_off" label="Wifi settings">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi
              magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus
              ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item expand-separator icon="drafts" label="Drafts" header-class="text-purple">
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi
              magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus
              ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item icon="assessment" label="Disabled" disable>
          <q-card>
            <q-card-section>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti commodi
              magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste eveniet doloribus
              ullam aliquid.
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          Venue
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import Navbar from "./components/Navbar";
import "./assets/venue.css";
export default {
  name: "App",
  components: {
    // Navbar
  },
  data() {
    return {
      left: false
    };
  }
};
</script>

<style>
/* body {
  margin: 0;
  padding: 0;
} */
* {
  font-family: "Comfortaa", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* #app {
  text-align: center;
  position: absolute;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  background: var(--venue-light);
}
#main {
  position: absolute;
  top: 6rem;
  height: calc(100% - 6rem);
  width: 100%;
} */
</style>
