<template>
  <q-layout id="app" view="lhr Lpr lfr">
    <q-header elevated class="text-primary">
      <q-toolbar>
        <q-icon size="sm" flat name="menu" @click="left = !left" />
        <!-- <q-input borderless v-model="searchString" class="q-ml-md">
          <template v-slot:append>
            <q-icon v-if="searchString === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="searchString = ''" />
          </template>
        </q-input> -->
        <q-toolbar-title>
          <q-avatar>
            <VenueLogo id="nav-logo" />
          </q-avatar>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above elevated v-model="left" side="left">
      <q-input borderless v-model="searchString" label="Search..." class="q-ml-md q-mr-md">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="searchString">
          <q-icon name="close" @click="searchString = ''" class="cursor-pointer" />
        </template>
      </q-input>
      <q-list class="text-primary">
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

        <q-separator spaced="1rem" />

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
          <q-avatar size="md">
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

/* main { */
/* border-radius: 1rem 0rem 0rem 1rem; */
/* box-shadow: inset 0.75rem 0.75rem 0.75rem #bebebe, inset -0.75rem -0.75rem 0.75rem #f8f8f8; */
/* } */

#nav-logo {
  width: 100%;
}
</style>
