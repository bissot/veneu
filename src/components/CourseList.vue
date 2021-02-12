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
                <q-item clickable class="cursor-pointer q-pr-none" v-for="group of course.user_groups" :key="group.id">
                  <q-item-section avatar>
                    <q-icon name="groups" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ group.name }}</q-item-label>
                    <q-item-label caption>
                      {{ group.auths.filter(a => a.role == "STUDENT").length }} students
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-btn
                      flat
                      size="sm"
                      round
                      icon="share"
                      class="q-mx-sm text-primary"
                      title="Share"
                      aria-label="Share"
                      @click.stop
                    />
                  </q-item-section>
                </q-item>
                <q-btn
                  dense
                  flat
                  class="full-width q-my-sm"
                  label="New"
                  icon="add"
                  :to="{ path: '/create-user-group?parent_resource=' + (course.id ? course.id : '') }"
                />
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
