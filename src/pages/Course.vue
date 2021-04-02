<template>
  <q-page class="q-pt-md">
    <ApolloQuery :query="require('../graphql/Course.gql')" :variables="{ _id: $route.params._id }">
      <template slot-scope="{ result: { loading, error, data } }">
        <div v-if="loading">Loading...</div>
        <div v-if="error">Error...</div>
        <div v-if="data && data.course" class="q-px-md" id="courseloaded">
          <div>
            <h1 class="q-pa-sm">{{ data.course.name }}</h1>
            <div class="row full-width q-mt-sm q-mb-md">
              <ShareResourceModal :resourceid="data.course._id" resourcetype="Course" :me="me" />
              <q-space />
              <ApolloMutation
                :mutation="require('../graphql/DeleteCourse.gql')"
                :variables="{ _id: data.course._id }"
                @done="onDelete"
                class="flex inline"
              >
                <template slot-scope="{ mutate }">
                  <q-btn
                    class="bg-red text-white q-mt-md"
                    label="Delete"
                    icon-right="delete"
                    type="submit"
                    @click="mutate()"
                  />
                </template>
              </ApolloMutation>
            </div>
            Description: {{ data.course.description }}
          </div>
          <!-- <h2 class="q-py-none q-px-sm">Resources</h2>
        <q-tree class="text-primary" :nodes="simple" accordion node-key="label" :expanded.sync="expanded" /> -->
        </div>
      </template>
    </ApolloQuery>
  </q-page>
</template>

<script>
import ShareResourceModal from "../components/ShareResourceModal.vue";
export default {
  components: { ShareResourceModal },
  props: {
    me: Object
  },
  data() {
    return {};
  },

  methods: {
    onDelete() {
      location.href = "/dashboard";
    }
  }
};
</script>

<style scoped>
.col-12 {
  overflow: auto;
}
</style>
