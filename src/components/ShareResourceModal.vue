<template>
  <div class="share-resource-modal-container flex inline">
    <q-btn size="md" label="Share" title="Share" color="primary" @click="isOpen = true" class="q-mt-md" icon="share" />
    <q-dialog v-model="isOpen" noBackdropDismiss persistent>
      <q-card>
        <q-card-section class="row">
          <div class="text-h6 text-primary">Share {{ resourcetype }}</div>
        </q-card-section>

        <q-separator inset class="q-my-sm" />

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

        <q-separator inset class="q-my-sm" />

        <ApolloMutation
          :mutation="
            gql => gql`
              mutation($emailInput: String!, $roleSelection: Role!, $resourseId: ID!, $sharedResourceType: String!) {
                createAuth(
                  user: $emailInput
                  role: $roleSelection
                  shared_resource: $resourseId
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
            resourceId: resourceid,
            sharedResourceType
          }"
        >
          <template v-slot="{ mutate, loading }">
            <q-card-section class="row text-primary">
              <q-btn label="Cancel" v-close-popup @click="clearForm" />
              <q-space />
              <q-btn
                v-close-popup
                color="primary"
                @click="mutate()"
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
</template>

<script>
export default {
  props: {
    resourceid: String,
    resourcetype: String
  },
  data() {
    return {
      isOpen: false,
      submitShareCourse: false,
      emailInput: "",
      roleSelection: null,
      roleOptions: ["INSTRUCTOR", "TEACHING_ASSISTANT", "STUDENT"],
      sharedResourceType: "Course"
    };
  },
  methods: {
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
    }
  }
};
</script>
