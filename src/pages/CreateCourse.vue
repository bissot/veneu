<template>
  <div id="create-course" class="container">
    <div class="vertical-center">
      <!-- <img alt="Venue Logo" src="../assets/venue-logo.svg" /> -->
      <div>
        <i><h1>Teach a New Course</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateCourse.gql')"
        :variables="{ name, prefix, suffix, start, end }"
        class="form"
        @done="handleCreateCourse"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-md q-ma-lg q-mt-xl neu-convex">
            <q-stepper
              id="signup-stepper"
              v-model="step"
              ref="stepper"
              flat
              animated
              active-color="primary"
              inactive-color="secondary"
              contracted
            >
              <q-step :name="1" prefix="1" title="a" class="q-pt-sm">
                <q-input
                  standout="bg-primary text-white q-ma-none"
                  color="primary"
                  class="text-primary q-mt-none"
                  v-model="name"
                  label="Course Name"
                  placeholder="e.g. Computer Science I"
                >
                  <!-- <template v-slot:prepend>
                    <q-icon name="email" />
                  </template> -->
                </q-input>
              </q-step>

              <q-step :name="2" prefix="2" title="a" class="q-pt-sm">
                <q-input
                  type="text"
                  standout="bg-primary text-white"
                  color="primary"
                  v-model="prefix"
                  label="Department Prefix"
                  placeholder="e.g. CSCI"
                >
                  <template v-slot:prepend>
                    <q-icon name="sort_by_alpha" />
                  </template>
                </q-input>
                <q-input
                  type="number"
                  standout="bg-primary text-white"
                  color="primary"
                  v-model="suffix"
                  label="Course Level"
                  class="q-mt-lg"
                  placeholder="e.g. 101"
                >
                  <template v-slot:prepend>
                    <q-icon name="pin" />
                  </template>
                </q-input>
              </q-step>

              <q-step :name="3" prefix="3" class="q-pt-sm" title="a">
                <q-input
                  v-model="start"
                  type="text"
                  standout="bg-primary text-white"
                  color="primary"
                  label="Start Time"
                  placeholder="e.g. 1970-01-01 14:00"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="start" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="start" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-input
                  v-model="end"
                  type="text"
                  standout="bg-primary text-white"
                  color="primary"
                  label="End Time"
                  placeholder="e.g. 1970-01-01 14:00"
                  class="q-mt-lg"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="end" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>

                  <template v-slot:append>
                    <q-icon name="access_time" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-time v-model="end" mask="YYYY-MM-DD HH:mm">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </q-step>

              <template v-slot:navigation>
                <q-stepper-navigation class="q-pb-xs">
                  <q-bar class="q-pa-none q-pl-md q-gutter-x-md">
                    <q-btn v-if="step == 1" flat color="primary" @click="handleBack" label="Back" />
                    <q-btn v-else flat color="primary" @click="$refs.stepper.previous()" label="Back" />
                    <q-btn
                      v-if="step < 3"
                      @click="$refs.stepper.next()"
                      color="primary"
                      label="Continue"
                      class="q-ml-sm full-width"
                      :disable="(step == 1 && !name) || (step == 2 && (!prefix || !suffix))"
                    />
                    <q-btn v-else type="submit" color="primary" label="Finish" class="q-ml-sm full-width" />
                  </q-bar>
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateCourse",
  data() {
    return {
      step: 1,
      name: "",
      prefix: "",
      suffix: null,
      start: "",
      end: ""
    };
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    formValid() {
      return this.name.length && this.prefix.length && this.suffix && this.start && this.end;
    },
    handleCreateCourse() {
      this.$router.push({ name: "Dashboard" });
    }
  }
};
</script>

<style scoped>
#create-course {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
  text-align: center;
}
h1 {
  font-size: 3rem;
}
.form {
  margin: auto;
  max-width: 24rem;
}
#actions {
  position: relative;
  display: block;
  width: 100%;
  text-align: right;
}
/* button {
  margin: 1rem 0rem 0rem 0rem;
} */
.spinner {
  width: 14rem;
  margin: auto;
}
#signup-stepper {
  width: 100%;
  margin: 2rem auto;
  border-radius: 1rem !important;
  background: unset;
}
.q-stepper__nav {
  border-radius: 1rem;
}
</style>
