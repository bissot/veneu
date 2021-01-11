<template>
  <div class="apollo-example">

    <!-- Tchat example -->
    <ApolloQuery :query="require('../graphql/BookAPI.gql')">

      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <div
            v-for="book of data.books"
            :key="book.title"
            class="message"
          >
            {{ book.title }}
          </div>
        </template>
      </div>
    </ApolloQuery>

  </div>
</template>

<script>

export default {
  data() {
    return {
    };
  },

  apollo: {
  },

  computed: {
  },

  methods: {
  }
};
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
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
