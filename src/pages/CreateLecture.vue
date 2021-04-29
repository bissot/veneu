<template>
  <q-page id="create-course" class="container">
    <div class="vertical-center">
      <div>
        <i><h1>Create a New Lecture</h1></i>
      </div>
      <ApolloMutation
        :mutation="require('../graphql/CreateLecture.gql')"
        :variables="{ name, parent_resource, parent_resource_type, start, end }"
        class="form"
        @done="handleCreateLecture"
      >
        <template slot-scope="{ mutate }">
          <q-form @submit.prevent="handleSubmit(mutate)" class="q-gutter-md q-ma-lg q-mt-xl q-py-md neu-convex">
            <ResourceSelector :me="me" label="For Resource..." @change="handleChangeResource" />
            <q-input
              standout="bg-primary text-white q-ma-none"
              color="primary"
              class="text-primary q-mt-none"
              v-model="name"
              label="Lecture Name"
              placeholder="e.g. S-2021 01"
            >
            </q-input>
            <div class="row full-width q-px-md q-py-md">
              <q-date
                v-model="date"
                mask="YYYY-MM-DD"
                color="primary"
                class="col-12 neu-convex"
                subtitle="What day is the lecture on?"
                @change="dateChange"
              />
            </div>
            <div class="row full-width q-px-md items-center justify-center">
              What are the start and end times?
            </div>
            <div class="row full-width q-px-md q-pb-md">
              <q-time
                v-model="start"
                color="primary"
                mask="YYYY-MM-DD HH:mm"
                class="col-12 col-sm q-mr-md neu-convex q-mt-md"
                label="Start"
              />
              <q-time v-model="end" color="primary" mask="YYYY-MM-DD HH:mm" class="col-12 col-sm neu-convex q-mt-md" />
            </div>
            <q-bar class="q-pa-none q-gutter-x-md">
              <q-btn label="Back" class="q-ml-sm" @click="handleBack" />
              <q-btn
                type="submit"
                color="primary"
                label="Continue"
                class="q-ml-sm full-width"
                :disabled="!formValid()"
              />
            </q-bar>
          </q-form>
        </template>
      </ApolloMutation>
    </div>
  </q-page>
</template>

<script>
import ResourceSelector from "../components/ResourceSelector";
export default {
  name: "CreateRegistrationSection",
  props: {
    me: Object
  },
  components: {
    ResourceSelector
  },
  data() {
    return {
      name: "",
      date: null,
      parent_resource: null,
      parent_resource_type: null,
      start: "",
      end: ""
    };
  },
  methods: {
    handleSubmit(mutate) {
      mutate();
    },
    handleBack() {
      this.$router.go(-1);
    },
    formValid() {
      if (!this.parent_resource || !this.parent_resource_type) {
        return false;
      }
      if (!this.name) {
        return false;
      }
      if (!this.date || !this.start || !this.end || this.start > this.end) {
        return false;
      }
      return true;
    },
    handleCreateLecture() {
      location.href = "/dashboard";
    },
    handleChangeResource(resource, type) {
      this.parent_resource = resource;
      let a = this.me.auths.find(a => a.shared_resource._id == resource);
      if (a) {
        this.parent_resource_type = a.shared_resource_type;
      }
    },
    dateChange(date) {
      this.start = date + " " + this.start;
      this.end = date + " " + this.end;
    }
  }
};
</script>

<style scoped></style>
