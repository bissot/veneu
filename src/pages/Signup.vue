<template>
  <div id="login-page" class="container">
    <div class="vertical-center">
      <VenueLogo class="spinner" />
      <div>
        <i><h1>Signup</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateUser.gql')"
        :variables="{ email, password, first_name, last_name }"
        class="form"
        @done="handleSignup"
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
              <q-step :name="1" prefix="1" title="a">
                <q-input
                  standout="bg-primary text-white q-ma-none"
                  color="primary"
                  class="text-primary q-mt-none"
                  v-model="email"
                  label="Email"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>
              </q-step>

              <q-step :name="2" prefix="2" title="a">
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
              </q-step>

              <q-step :name="3" prefix="3" class="q-gutter-y-md" title="a">
                <q-input
                  standout="bg-primary text-white"
                  color="primary"
                  class="text-primary q-mb-lg q-mt-none"
                  v-model="first_name"
                  label="First Name"
                >
                  <!-- <template v-slot:prepend>
                    <q-icon name="face" />
                  </template> -->
                </q-input>
                <q-input
                  standout="bg-primary text-white"
                  color="primary"
                  class="text-primary"
                  v-model="last_name"
                  label="Last / Family Name"
                >
                  <!-- <template v-slot:prepend>
                    <q-icon name="family_restroom" />
                  </template> -->
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
                      :disable="step == 1 && !email"
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
import VenueLogo from "../components/VenueLogo";
export default {
  name: "Signup",
  components: {
    VenueLogo
  },
  data() {
    return {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      step: 1
    };
  },
  methods: {
    formValid() {
      return (
        this.email.length &&
        this.password.length &&
        this.first_name.length &&
        this.last_name.length &&
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)
      );
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
  overflow-y: auto;
}
h1 {
  font-family: "Exo 2";
  /* font-size: calc(6vw + 1rem); */
  padding: 0;
  margin: 0;
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
