<template>
  <q-page id="login-page" class="container">
    <div class="vertical-center">
      <VenueLogo class="spinner" />
      <div>
        <i><h1>Signup</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateUser.gql')"
        :variables="{ email }"
        class="form"
        @done="handleSignup"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="formValid && mutate()" class="q-gutter-y-lg q-pa-lg q-ma-lg neu-convex">
            <q-input
              standout="bg-primary text-white"
              color="primary"
              class="text-primary q-pa-none q-ma-none"
              v-model="email"
              label="Email"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-btn label="Submit" type="submit" color="primary" icon-right="check" class="q-ml-sm full-width" />
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </q-page>
</template>

<script>
import VenueLogo from "../components/VenueLogo";
export default {
  name: "Signup",
  components: {
    VenueLogo
  },
  data() {
    return {
      email: ""
    };
  },
  methods: {
    formValid() {
      return this.isValidEmail(this.email);
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      if (emailPattern.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    handleSignup(res) {
      if (res && res.data && res.data.login) {
        window.localStorage.setItem("token", res.data.login);
      }
      (this.email = ""), (this.password = "");
      this.$router.push({ name: "Login" });
    },
    handleBack() {
      this.$router.push({ name: "Landing" });
    }
  }
};
</script>

<style scoped>
#login-page {
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
}
h1 {
  padding: 0;
  margin: 0;
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
