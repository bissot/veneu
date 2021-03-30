<template>
  <ApolloQuery :query="require('../graphql/Course.gql')" :variables="{ _id: $route.params._id }">
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data && data.course" class="q-px-md" id="courseloaded">
        <div>
          <h1 class="q-pa-sm">{{ data.course.name }}</h1>
          {{ data.course.description }}
          <div>
            Instructors:
            <div
              v-for="(auth, i) in data.course.auths.filter(a => a.role == 'INSTRUCTOR')"
              :key="auth._id"
              style="display: inline-block;"
            >
              {{ i > 0 ? ", " : "" }}{{ auth.user.first_name }} {{ auth.user.last_name }}
            </div>
          </div>
          <div>
            Teaching Assistants:
            <div
              v-for="(auth, i) in data.course.auths.filter(a => a.role == 'TEACHING_ASSISTANT')"
              :key="auth._id"
              style="display: inline-block;"
            >
              {{ i > 0 ? ", " : "" }}{{ auth.user.first_name }} {{ auth.user.last_name }}
            </div>
          </div>
          <div>
            Students:
            <div
              v-for="(auth, i) in data.course.auths.filter(a => a.role == 'STUDENT')"
              :key="auth._id"
              style="display: inline-block;"
            >
              {{ i > 0 ? ", " : "" }}{{ auth.user.first_name }} {{ auth.user.last_name }}
            </div>
          </div>
        </div>

        <div>
          <div>
            <q-btn
              size="md"
              label="Share"
              title="Share"
              color="primary"
              @click="shareCourseDialog = true"
              class="q-mt-md"
              icon="share"
            />

            <ApolloMutation
              :mutation="require('../graphql/DeleteCourse.gql')"
              :variables="{ _id: data.course._id }"
              @done="onDelete"
            >
              <template slot-scope="{ mutate }">
                <q-form @submit.prevent="mutate()">
                  <q-btn class="bg-red text-white q-mt-md" label="Delete" icon="delete" type="submit" />
                </q-form>
              </template>
            </ApolloMutation>

            <q-dialog v-model="shareCourseDialog" noBackdropDismiss>
              <q-card>
                <q-card-section class="row">
                  <div class="text-h6">Share Course</div>
                  <q-space />
                  <q-btn @click="clearForm" icon="close" flat round dense v-close-popup />
                </q-card-section>

                <q-separator inset />

                <q-card-section style="max-height: 50vh" class="scroll">
                  <q-input
                    standout="bg-primary text-white"
                    class="text-primary"
                    v-model="emailInput"
                    color="primary"
                    label="Add people"
                    placeholder="abc@xyz.com"
                  />
                  <q-select
                    standout="bg-primary text-white"
                    class="text-primary q-mt-md"
                    color="primary"
                    v-model="roleSelection"
                    :options="roleOptions"
                    label="User Role"
                  />
                </q-card-section>

                <q-separator inset />

                <ApolloMutation
                  :mutation="
                    gql => gql`
                      mutation(
                        $emailInput: String!
                        $roleSelection: Role!
                        $courseId: ID!
                        $sharedResourceType: String!
                      ) {
                        createAuth(
                          user: $emailInput
                          role: $roleSelection
                          shared_resource: $courseId
                          shared_resource_type: $sharedResourceType
                        ) {
                          _id
                        }
                      }
                    `
                  "
                  :variables="{
                    emailInput,
                    roleSelection,
                    courseId: data.course._id,
                    sharedResourceType
                  }"
                >
                  <template v-slot="{ mutate, loading }">
                    <q-card-section align="right">
                      <q-btn
                        v-close-popup
                        color="primary"
                        @click="shareCourse(mutate)"
                        label="Done"
                        :loading="loading"
                        :disabled="isDisabled()"
                      >
                        <template v-slot:loading>
                          <q-spinner-dots />
                        </template>
                      </q-btn>
                    </q-card-section>
                  </template>
                </ApolloMutation>
              </q-card>
            </q-dialog>
          </div>
        </div>

        <!-- <h2 class="q-py-none q-px-sm">Resources</h2>
        <q-tree class="text-primary" :nodes="simple" accordion node-key="label" :expanded.sync="expanded" /> -->
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  data() {
    return {
      shareCourseDialog: false,
      submitShareCourse: false,
      emailInput: "",
      roleSelection: null,
      roleOptions: ["INSTRUCTOR", "TEACHING_ASSISTANT", "STUDENT"],
      sharedResourceType: "Course"
    };
  },

  methods: {
    shareCourse(mutate) {
      console.log("Sharing Couse to " + this.emailInput + " with Access: " + this.roleSelection);
      mutate();
    },
    isValidEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      if (emailPattern.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    isRoleSelected(val) {
      if (val == null) {
        return false;
      }
      return true;
    },
    isDisabled() {
      return !this.isValidEmail(this.emailInput) || !this.isRoleSelected(this.roleSelection);
    },
    clearForm() {
      this.emailInput = "";
      this.roleSelection = "";
    },
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
