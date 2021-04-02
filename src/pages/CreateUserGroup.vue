<template>
  <q-page id="create-course" class="container">
    <div class="vertical-center">
      <div>
        <i><h1>Create a New Group</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateUserGroup.gql')"
        :variables="{ name, parent_resource }"
        class="form"
        @done="handleCreateUserGroup"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-md q-ma-lg q-mt-xl q-py-md neu-convex">
            <q-input
              standout="bg-primary text-white q-ma-none"
              color="primary"
              class="text-primary q-mt-none"
              v-model="name"
              label="Group Name"
              placeholder="e.g. Team 2"
            >
            </q-input>
            <q-bar class="q-pa-none q-gutter-x-md">
              <q-btn type="submit" color="primary" label="Continue" class="q-ml-sm full-width" :disable="!name" />
            </q-bar>
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "CreateUserGroup",
  data() {
    return {
      step: 1,
      name: "",
      parent_resource: null
    };
  },
  mounted() {
    if (this.$route.query.parent_resource) {
      this.parent_resource = this.$route.query.parent_resource;
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    formValid() {
      return this.name.length;
    },
    handleCreateUserGroup() {
      this.name = "";
      this.parent_resource = null;
      this.$router.push({ name: "Dashboard" });
    }
  }
};
</script>

<style scoped>
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
