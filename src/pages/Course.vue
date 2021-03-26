<template>
  <ApolloQuery :query="require('../graphql/Course.gql')" :variables="{ _id: $route.params._id }">
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data" class="row q-px-md" id="courseloaded">
        <div class="col-12 col-md-6 q-px-sm">
          <h1>{{ data.course.name }}</h1>

          <div>
            {{data.course.description}}
          </div>

          <div>
             Instructors:
            <span v-for="(auth, index) in data.course.auths.filter(a => a.role == 'INSTRUCTOR')"
                 :key="auth._id">
              {{auth.user.first_name}} {{auth.user.last_name}}
              <span v-if="index != (data.course.auths.filter(a => a.role == 'INSTRUCTOR').length - 1)">,</span>
            </span>

          </div>

          <div>
            Students:
            <span v-for="(auth, index) in data.course.auths.filter(a => a.role == 'STUDENT')"
                 :key="auth._id">
              {{auth.user.first_name}} {{auth.user.last_name}}
              <span v-if="index != (data.course.auths.filter(a => a.role == 'STUDENT').length - 1)">,</span>
            </span>
          </div>

          <div>
            <div>
                <q-btn
                  label="Share"
                  title="Share"
                  color="primary"
                  @click="shareCourseDialog = true"
                />

                <q-dialog v-model="shareCourseDialog" noBackdropDismiss>
                  <q-card>

                    <q-card-section class="row">
                      <div class="text-h6">Share Course</div>
                      <q-space />
                      <q-btn @click="clearForm" icon="close" flat round dense v-close-popup />
                    </q-card-section>

                    <q-separator/>

                    <q-card-section style="max-height: 50vh" class="scroll">
                      <q-input filled v-model="emailInput" label="Add people" placeholder="email@gmail.com" :rules="[val => !!val || 'Email is required.', isValidEmail]"/>
                      <q-select filled v-model="roleSelection" :options="roleOptions" label="User Role" :rules="[val => !!val || 'Role is required.']"/>
                    </q-card-section>

                    <q-separator/>

                    <ApolloMutation
                     :mutation="gql => gql`
                       mutation ($emailInput: String!, $roleSelection: Role!, $courseId: ID!, $sharedResourceType: String! ) {
                         createAuth (user: $emailInput, role: $roleSelection, shared_resource: $courseId, shared_resource_type: $sharedResourceType) {
                           _id
                         }
                       }
                     `"
                     :variables="{
                       emailInput,
                       roleSelection,
                       courseId: data.course._id,
                       sharedResourceType
                     }"
                   >

                   <template v-slot="{ mutate, loading}">
                     <q-card-section align="end">
                       <q-btn color="primary" @click="shareCourse(mutate)" label="Done" :loading="loading" :disabled="isDisabled()">
                         <template v-slot:loading>
                             <q-spinner-dots/>
                         </template>
                       </q-btn>
                     </q-card-section>
                   </template>


                  </ApolloMutation>

                  </q-card>
                </q-dialog>

            </div>

          </div>
        </div>
        <!-- <q-separator v-if="!($q.screen.lt.sm || $q.screen.lt.md)" vertical spaced="-1px" inset /> -->
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
      roleOptions:[
        'INSTRUCTOR', 'TEACHING_ASSISTANT', 'STUDENT'
      ],
      sharedResourceType : "Course"
    };
  },

  methods: {
    shareCourse(mutate){

      console.log("Sharing Couse to " + this.emailInput + " with Access: " + this.roleSelection);
      mutate();

    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      if(emailPattern.test(val)){
        return true;
      }
      else{
        return false;
      }
    },
    isRoleSelected (val){
      if(val == null){
        return false;
      }
      return true;
    },
    isDisabled(){
      return !this.isValidEmail(this.emailInput) || !this.isRoleSelected(this.roleSelection);
    },
    clearForm(){
      this.emailInput = "";
      this.roleSelection = "";
    }
  },
};
</script>

<style scoped>
.col-12 {
  overflow: auto;
}
</style>
