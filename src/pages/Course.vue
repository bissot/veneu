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
            </div>
            <div class="row full-width">Description: {{ data.course.description }}</div>
            <div class="row full-width justify-center q-mt-xl">
              <div class="q-pa-md q-ma-md dangerzone">
                <ApolloMutation
                  :mutation="require('../graphql/DeleteCourse.gql')"
                  :variables="{ _id: data.course._id }"
                  @done="onDelete"
                  class="flex inline"
                >
                  <template slot-scope="{ mutate }">
                    <q-dialog v-model="deleteModal" persistent>
                      <q-card class="q-pa-sm">
                        <q-card-section class="row items-center">
                          <q-avatar icon="delete" color="red" text-color="white" />
                          <span class="q-ml-sm">Are you sure? This is <b>permanent</b>.</span>
                        </q-card-section>

                        <q-card-actions>
                          <q-btn label="Cancel" class="text-primary" v-close-popup />
                          <q-space />
                          <q-btn
                            label="Delete"
                            color="white"
                            class="bg-red"
                            v-close-popup
                            @click="mutate()"
                            type="submit"
                          />
                        </q-card-actions>
                      </q-card>
                    </q-dialog>
                    <q-btn class="bg-red text-white" label="Delete" icon-right="delete" @click="deleteModal = true" />
                  </template>
                </ApolloMutation>
              </div>
            </div>
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
    return {
      deleteModal: false
    };
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
