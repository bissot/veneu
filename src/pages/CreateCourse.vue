<template>
  <div id="create-course" class="container">
    <div class="vertical-center">
      <ApolloMutation
        :mutation="require('../graphql/CreateCourse.gql')"
        :variables="{ name, prefix, suffix, start, end }"
        class="form"
        @done="handleCreateCourse"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-md q-ma-lg q-px-md q-py-lg neu-convex">
            <div>
              <i><h1>New Course...</h1></i>
            </div>
            <q-input
              standout="bg-primary text-white q-ma-none"
              color="primary"
              class="text-primary q-mt-none"
              v-model="name"
              label="Name"
              placeholder="e.g. Computer Science I"
            >
            </q-input>
            <q-separator class="q-my-lg" />
            <q-input
              type="text"
              standout="bg-primary text-white"
              color="primary"
              v-model="prefix"
              label="Department"
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
              label="Number"
              placeholder="e.g. 101"
            >
              <template v-slot:prepend>
                <q-icon name="pin" />
              </template>
            </q-input>
            <q-separator class="q-my-lg" />
            <q-input
              v-model="start"
              type="text"
              standout="bg-primary text-white"
              color="primary"
              label="Start Date"
              placeholder="e.g. 1970-01-01"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="start" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <!-- <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="start" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template> -->
            </q-input>

            <q-input
              v-model="end"
              type="text"
              standout="bg-primary text-white"
              color="primary"
              label="End Date"
              placeholder="e.g. 1970-01-01"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="end" mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <!-- <template v-slot:append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="end" mask="YYYY-MM-DD HH:mm">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template> -->
            </q-input>
            <q-separator class="q-my-lg" />
            <q-bar class="q-pa-none q-gutter-x-md">
              <q-btn flat color="primary" @click="handleBack" label="Back" />
              <q-btn
                type="submit"
                color="primary"
                label="Finish"
                class="q-ml-sm full-width"
                :disabled="formValid() ? false : true"
              />
            </q-bar>
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
      return this.name.length && this.prefix.length && this.suffix && this.start.length && this.end.length;
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
  font-size: 2rem;
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
</style>
