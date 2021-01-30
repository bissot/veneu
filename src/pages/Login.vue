<template>
  <div id="landing-page" class="container">
    <div class="vertical-center">
      <img alt="Venue Logo" src="../assets/venue-logo.svg" />
      <div>
        <i><h1>Login</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/Login.gql')"
        :variables="{ email, password }"
        class="form"
        @done="handleLogin"
      >
        <template slot-scope="{ mutate }">
          <form v-on:submit.prevent="formValid && mutate()" class="neu-convex">
            <input id="email" type="text" aria-label="email" placeholder="email" v-model="email" />
            <input id="password" type="password" aria-label="password" placeholder="password" v-model="password" />
            <!-- <button v-if="loading">...</button> -->
            <button>Submit</button>
          </form>
        </template>
      </ApolloMutation>
    </div>
  </div>
</template>

<script>
export default {
  name: "Landing",
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
        window.localStorage.setItem("token", "Bearer " + res.data.login);
      }
      (this.email = ""), (this.password = "");
      this.$router.push({ path: this.$router.history.current.query.redirect || "/dashboard" });
    }
  }
};
</script>

<style scoped>
img {
  width: 50%;
  max-width: 50rem;
}
#landing-page {
  width: 100%;
  max-width: 50rem;
  margin: auto;
  height: 100%;
  position: relative;
}
h1 {
  font-family: "Exo 2";
  font-size: calc(6vw + 1rem);
  padding: 0;
  margin: 0;
}
.vertical-center {
  width: 100%;
}
form {
  margin: 2rem;
  padding: 1.5rem;
}
</style>
