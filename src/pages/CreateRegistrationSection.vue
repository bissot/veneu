<template>
  <div id="create-course" class="container">
    <div class="vertical-center">
      <div>
        <i><h1>Create a New Registration Section</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateRegistrationSection.gql')"
        :variables="{ name, course }"
        class="form"
        @done="handleCreateRegistrationSection"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-md q-ma-lg q-mt-xl q-py-md neu-convex">
            <q-input
              standout="bg-primary text-white q-ma-none"
              color="primary"
              class="text-primary q-mt-none"
              v-model="name"
              label="Section Name"
              placeholder="e.g. S-2021 01"
            >
            </q-input>
            <q-bar class="q-pa-none q-gutter-x-md">
              <q-btn type="submit" color="primary" label="Continue" class="q-ml-sm full-width" :disable="!name" />
            </q-bar>
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateRegistrationSection",
  data() {
    return {
      step: 1,
      name: "",
      course: null
    };
  },
  created() {
    if (this.$route.query.course) {
      this.course = this.$route.query.course;
    }
    console.log("PARENTRESOURCE", this.course);
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    formValid() {
      return this.name.length;
    },
    handleCreateRegistrationSection() {
      this.name = "";
      this.course = null;
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
