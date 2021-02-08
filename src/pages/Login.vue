<template>
  <div id="login-page" class="container">
    <div class="vertical-center">
      <VenueLogo class="spinner" />
      <div class="q-mb-xl">
        <i><h1>Login</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/Login.gql')"
        :variables="{ email, password }"
        class="form"
        @done="handleLogin"
      >
        <template slot-scope="{ mutate }">
          <q-form
            @submit.prevent="formValid && mutate()"
            class="q-gutter-y-md q-pl-lg q-pr-lg q-pb-lg q-pt-md q-ma-lg neu-convex"
          >
            <q-input standout="bg-primary text-white" color="primary" v-model="email" label="Email">
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>
            <q-input
              type="password"
              standout="bg-primary text-white"
              color="primary"
              v-model="password"
              label="Password"
            >
              <template v-slot:prepend>
                <q-icon name="password" />
              </template>
            </q-input>

            <q-bar class="bg-none q-pa-none q-gutter-x-md q-gutter-y-none q-pl-md">
              <q-btn label="Back" type="reset" color="primary" flat @click="handleBack" />
              <q-btn label="Submit" type="submit" color="primary" icon-right="check" class="q-ml-sm full-width" />
            </q-bar>
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </div>
</template>

<script>
import VenueLogo from "../components/VenueLogo";
export default {
  name: "Login",
  components: {
    VenueLogo
  },
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    formValid() {
      return (
        this.email != "" &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email) &&
        this.password.length
      );
    },
    handleLogin(res) {
      if (res && res.data && res.data.login) {
        window.localStorage.setItem("token", res.data.login);
      }
      (this.email = ""), (this.password = "");
      this.$router.push({ path: this.$router.history.current.query.redirect || "/dashboard" });
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
  font-family: "Exo 2";
  /* font-size: calc(6vw + 1rem); */
  padding: 0;
  margin: 0;
}

.form {
  margin: auto;
  width: 100%;
  max-width: 28rem;
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
</style>
