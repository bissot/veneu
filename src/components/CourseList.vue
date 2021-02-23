<template>
  <ApolloQuery :query="require('../graphql/Courses.gql')">
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data">
        <q-item-label header class="text-primary">Courses </q-item-label>
        <div class="q-pb-md">
          <q-btn-group spread flat class="q-ml-md q-mr-md">
            <q-btn dense size="sm" label="New" icon="add" :to="{ name: 'CreateCourse' }" />
            <q-btn disabled dense size="sm" label="Join" icon="group_add" />
            <q-btn
              dense
              size="sm"
              :label="editing ? 'Done' : 'Edit'"
              :icon="editing ? 'check' : 'edit'"
              @click="editing = !editing"
            />
          </q-btn-group>
        </div>
        <q-expansion-item
          v-for="course of data.courses"
          :key="course.id"
          expand-separator
          icon="school"
          :label="course.name"
          :caption="course.prefix + ' ' + course.suffix"
          expand-icon-class="text-primary"
          :header-inset-level="0"
          :content-inset-level="0.5"
        >
          <q-list class="rounded-borders">
            <!-- <q-expansion-item
              expand-separator
              icon="event_seat"
              label="Registration Sections"
              :header-inset-level="0.25"
              :content-inset-level="0.5"
              expand-icon-class="text-primary"
            >
              
            </q-expansion-item> -->

            <q-btn-group v-if="editing" spread flat class="q-ml-md q-mr-md">
              <q-btn
                dense
                size="sm"
                label="Section"
                icon="add"
                :to="{ path: '/create-registration-section?course=' + (course.id ? course.id : '') }"
              />
              <q-btn
                dense
                size="sm"
                label="Group"
                icon="add"
                :to="{ path: '/create-user-group?parent_resource=' + (course.id ? course.id : '') }"
              />
            </q-btn-group>

            <!-- <div class="q-px-md">
              <q-btn
                dense
                flat
                size="sm"
                class="full-width q-my-sm"
                label="Registration Section"
                icon="add"
                :to="{ path: '/create-registration-section?parent_resource=' + (course.id ? course.id : '') }"
              />
            </div>
            <div class="q-px-md">
              <q-btn
                dense
                size="sm"
                flat
                class="full-width q-my-sm"
                label="Course Group"
                icon="add"
                :to="{ path: '/create-user-group?parent_resource=' + (course.id ? course.id : '') }"
              />
            </div> -->
            <q-list class="rounded-borders">
              <q-expansion-item
                expand-separator
                icon="event_seat"
                class="cursor-pointer q-pr-none"
                :label="section.name"
                :caption="section.auths.filter(a => a.role == 'STUDENT').length + ' students'"
                v-for="section of course.registration_sections"
                :key="section.id"
                :header-inset-level="0"
                :content-inset-level="0.5"
                :title="section.name"
              >
                <div v-if="editing" class="q-px-md">
                  <q-btn
                    dense
                    size="sm"
                    flat
                    class="full-width q-my-sm"
                    label="Group"
                    icon="add"
                    :to="{ path: '/create-user-group?parent_resource=' + (section.id ? section.id : '') }"
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
                      >
                        <q-menu>
                          <q-input class="q-mx-md" />
                        </q-menu>
                      </q-btn>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>

            <!-- <q-expansion-item
              icon="groups"
              label="Groups"
              :header-inset-level="0.25"
              :content-inset-level="0.5"
              expand-icon-class="text-primary"
            >
              
            </q-expansion-item> -->
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
                  >
                    <q-menu>
                      <q-input class="q-mx-md" />
                    </q-menu>
                  </q-btn>
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
  data() {
    return {
      courses: [],
      editing: false
    };
  }
};
</script>

<style scoped></style>
