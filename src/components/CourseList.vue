<template>
  <ApolloQuery :query="require('../graphql/Courses.gql')">
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data">
        <q-expansion-item
          v-for="course of data.courses"
          :key="course.id"
          expand-separator
          icon="school"
          :label="course.name"
          :caption="course.prefix + ' ' + course.suffix"
          expand-icon-class="text-primary"
        >
          <q-list class="rounded-borders">
            <q-expansion-item
              icon="event_seat"
              label="Registration Sections"
              :header-inset-level="0.25"
              :content-inset-level="0.5"
              expand-icon-class="text-primary"
            >
              <q-list class="rounded-borders q-pr-md">
                <q-btn dense flat class="full-width q-my-sm" label="New" icon="add" />
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="groups"
              label="Groups"
              :header-inset-level="0.25"
              :content-inset-level="0.5"
              expand-icon-class="text-primary"
            >
              <q-list class="rounded-borders q-pr-md">
                <q-btn dense flat class="full-width q-my-sm" label="New" icon="add" :to="{ name: 'Dashboard' }" />
              </q-list>
            </q-expansion-item>
          </q-list>
        </q-expansion-item>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: "CourseList",
  data() {
    return {
      courses: []
    };
  }
};
</script>

<style scoped></style>
