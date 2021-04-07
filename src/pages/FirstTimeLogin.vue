<template>
  <div id="first_login" class="container">
    <div class="vertical-center">
      <VenueLogo class="spinner" />
      <div>
        <i><h1>Continue setting up...</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/FirstLogin.gql')"
        :variables="{ access_code, first_name, last_name, password }"
        class="form"
        @done="handleLogin"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-md q-ma-lg q-mt-xl neu-convex">
            <q-input
              type="password"
              standout="bg-primary text-white"
              color="primary"
              v-model="password"
              label="Password"
              class="q-mt-sm"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>

            <q-input
              standout="bg-primary text-white"
              color="primary"
              class="text-primary q-mb-lg q-mt-lg"
              v-model="first_name"
              label="First Name"
            />

            <q-input
              standout="bg-primary text-white"
              color="primary"
              class="text-primary"
              v-model="last_name"
              label="Last / Family Name"
            />

            <q-btn label="Submit" type="submit" color="primary" icon-right="check" class="q-ml-sm full-width" />
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </div>
</template>

<script>
import VenueLogo from "../components/VenueLogo";
export default {
  name: "FirstLogin",
  components: {
    VenueLogo
  },
  data() {
    return {
      access_code: this.$route.params.access_code,
      first_name: "",
      last_name: "",
      password: ""
    };
  },
  methods: {
    formValid() {
      return this.first_name && this.last_name && this.password;
    },
    handleLogin(res) {
      console.log(res);
      if (res && res.data && res.data.firstLogin) {
        this.$router.push({ name: "Login" });
      }
    }
  }
};
</script>
