<template>
  <div class="apollo-example">
    <ApolloQuery :query="require('../graphql/Users.gql')">
      <ApolloSubscribeToMore
        :document="require('../graphql/UserCreated.gql')"
        :update-query="onUserCreated"
      />
      <ApolloSubscribeToMore
        :document="require('../graphql/UserModified.gql')"
        :update-query="onUserModified"
      />
      <template slot-scope="{ result: { loading, error, data } }">
        <div v-if="loading">Loading...</div>
        <div v-if="error">Error...</div>
        <div v-if="data">
          <div v-for="user of data.users" :key="user.email" class="user">
            {{ user.first_name }} {{ user.last_name }}
          </div>
        </div>
      </template>
    </ApolloQuery>

    <ApolloMutation
      :mutation="require('../graphql/AddUser.gql')"
      :variables="{
        input: {
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email
        }
      }"
      class="form"
      @done="newUser = { first_name: '', last_name: '', email: '' }"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formValid && mutate()">
          <label for="field-first-name">First Name</label>
          <input
            id="field-first-name"
            v-model="newUser.first_name"
            placeholder="Teri"
            class="input"
            required
          />
          <label for="field-last-name">Last Name</label>
          <input
            id="field-last-name"
            v-model="newUser.last_name"
            placeholder="Smith"
            class="input"
            required
          />
          <label for="field-first-name">Email</label>
          <input
            id="field-first-name"
            v-model="newUser.email"
            placeholder="terismith123@xyz.com"
            class="input"
            required
          />
          <button>Go</button>
        </form>
      </template>
    </ApolloMutation>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newUser: { first_name: "", last_name: "", email: "" }
    };
  },

  apollo: {},

  computed: {},

  methods: {
    formValid() {
      return (
        this.newUser.first_name && this.newUser.last_name && this.newUser.email
      );
    },
    onUserCreated(previousResult, { subscriptionData }) {
      return {
        users: [...previousResult.users, subscriptionData.data.userCreated]
      };
    },
    onUserModified(previousResult, { subscriptionData }) {
      const index = previousResult.users.findIndex(
        x => x.id == subscriptionData.data.userModified.id
      );
      previousResult.users[index] = subscriptionData.data.userModified;
      return {
        users: previousResult.users
      };
    }
  }
};
</script>

<style scoped>
.form,
.input,
.apollo,
.user {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
  grid-gap: 10px;
}

.image-item {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border-radius: 8px;
}

.image {
  max-width: 100%;
  max-height: 100%;
}

.image-input {
  margin: 20px;
}
</style>
