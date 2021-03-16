<template>
  <ApolloQuery :query="require('../graphql/Courses.gql')">
    <ApolloSubscribeToMore
      :document="require('../graphql/AddedToCourse.gql')"
      :variables="{ user: me._id }"
      :update-query="onAuthCreated"
    />
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data">
        <q-item-label header class="text-primary q-pb-md">Courses</q-item-label>
        <div class="">
          <q-btn-group spread flat class="q-mx-md q-mb-none">
            <q-btn dense size="sm" label="New" icon="add" :to="{ name: 'CreateCourse' }" />
            <q-btn disabled dense size="sm" label="Join" icon="group_add" />
            <q-btn dense size="sm" label="Edit" icon="edit" disabled />
          </q-btn-group>
        </div>
        <q-item-label header class="text-primary q-pb-md">Instructor for...</q-item-label>
        <q-expansion-item
          v-for="course of data.courses"
          :key="course.id"
          expand-icon-toggle
          expand-separator
          icon="school"
          class="courses"
          expand-icon-class="text-primary"
          :header-inset-level="0"
          :content-inset-level="0.5"
          group="courseGroup"
        >
          <q-item
            slot="header"
            class="col q-pl-md q-py-sm q-mr-sm q-pr-none"
            clickable
            :to="{ name: 'Course', params: { _id: course._id } }"
          >
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>

            <q-item-section :title="course.name">
              <q-item-label>{{ course.name }}</q-item-label>
              <q-item-label caption> {{ course.auths.filter(a => a.role == "STUDENT").length }} students </q-item-label>
            </q-item-section>
          </q-item>
          <q-list class="rounded-borders">
            <div class="q-pb-sm">
              <q-btn-group spread flat class="q-mx-md q-mt-sm">
                <q-btn
                  dense
                  size="sm"
                  label="Section"
                  icon="add"
                  :to="{ path: '/create-registration-section?course=' + (course._id ? course._id : '') }"
                />
                <q-btn
                  dense
                  size="sm"
                  label="Group"
                  icon="add"
                  :to="{ path: '/create-user-group?parent_resource=' + (course._id ? course._id : '') }"
                />
              </q-btn-group>
            </div>
            <q-list class="rounded-borders">
              <q-expansion-item
                expand-separator
                expand-icon-toggle
                icon="event_seat"
                class="q-pr-none"
                expand-icon-class="text-primary"
                v-for="section of course.registration_sections"
                :key="section.id"
                :header-inset-level="0"
                :content-inset-level="0.5"
              >
                <q-item slot="header" class="col q-px-md q-py-sm q-mr-sm" clickable>
                  <q-item-section avatar>
                    <q-icon name="event_seat" />
                  </q-item-section>

                  <q-item-section :title="section.name">
                    <q-item-label>{{ section.name }}</q-item-label>
                    <q-item-label caption>
                      {{ section.auths.filter(a => a.role == "STUDENT").length }} students
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <div class="q-px-md">
                  <q-btn
                    dense
                    size="sm"
                    flat
                    class="full-width q-my-sm"
                    label="Group"
                    icon="add"
                    :to="{ path: '/create-user-group?parent_resource=' + (section._id ? section._id : '') }"
                  />
                </div>
                <q-list class="rounded-borders">
                  <q-item
                    clickable
                    class="cursor-pointer q-pr-sm"
                    v-for="group of section.user_groups"
                    :key="group.id"
                    :title="group.name"
                  >
                    <q-item-section avatar>
                      <q-icon name="group" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ group.name }}</q-item-label>
                      <q-item-label caption>
                        {{ group.auths.filter(a => a.role == "STUDENT").length }} students
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>
            <q-list class="rounded-borders">
              <q-item
                clickable
                class="cursor-pointer q-pr-sm"
                v-for="group of course.user_groups"
                :key="group.id"
                :title="group.name"
              >
                <q-item-section avatar>
                  <q-icon name="groups" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ group.name }}</q-item-label>
                  <q-item-label caption>
                    {{ group.auths.filter(a => a.role == "STUDENT").length }} students
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-list>
        </q-expansion-item>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  name: "CourseList",
  props: {
    me: Object
  },
  data() {
    return {
      editing: false
    };
  },
  methods: {
    onAuthCreated(previousResult, { subscriptionData }) {
      return {
        courses: [...previousResult.courses, subscriptionData.data.authCreated.shared_resource]
      };
    }
  }
};
</script>

<style scoped></style>
