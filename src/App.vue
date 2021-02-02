<template>
  <q-layout id="app" view="lHr Lpr lfr">
    <q-header class="bg-primary text-white rounded-borders q-ma-md">
      <q-toolbar>
        <q-icon size="sm" flat name="menu" @click="left = !left" />
        <q-input dark borderless v-model="searchString" class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="searchString === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchString = ''" />
          </template>
        </q-input>
        <q-toolbar-title>
          <q-avatar>
            <img src="./assets/venue-logo.svg" />
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left">
      <q-list class="bg-primary text-white rounded-borders q-ml-md q-mt-md q-mb-md">
        <q-expansion-item
          expand-separator
          icon="school"
          label="Data Structures"
          caption="CSCI 1200"
          expand-icon-class="text-white"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="event_seat"
              label="Registration Section 02"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
              expand-icon-class="text-white"
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
              expand-icon-class="text-white"
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

        <q-expansion-item expand-separator icon="assignment" label="Assignments" expand-icon-class="text-white">
          <q-list class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="assignment_late"
              label="Due"
              :header-inset-level="0.25"
              :content-inset-level="0.25"
              expand-icon-class="text-white"
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
              expand-icon-class="text-white"
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
      left: false,
      searchString: ""
    };
  }
};
</script>

<style>
* {
  font-family: "Comfortaa", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
