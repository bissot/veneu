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
              {{ i > 0 ? "," : "" }}{{ auth.user.first_name }} {{ auth.user.last_name }}
            </div>
          </div>
          <div>
            Teaching Assistants:
            <div
              v-for="(auth, i) in data.course.auths.filter(a => a.role == 'TEACHING_ASSISTANT')"
              :key="auth._id"
              style="display: inline-block;"
            >
              {{ i > 0 ? "," : "" }}{{ auth.user.first_name }} {{ auth.user.last_name }}
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
        <h2 class="q-py-none q-px-sm">Resources</h2>
        <q-tree class="text-primary" :nodes="simple" accordion node-key="label" :expanded.sync="expanded" />
        <ApolloMutation
          :mutation="require('../graphql/DeleteCourse.gql')"
          :variables="{ _id: data.course._id }"
          @done="onDelete"
        >
          <template slot-scope="{ mutate }">
            <q-form class="row full-width justify-center" @submit.prevent="mutate()">
              <q-btn class="bg-red text-white" label="Delete" icon-right="delete" type="submit" />
            </q-form>
          </template>
        </ApolloMutation>
      </div>
    </template>
  </ApolloQuery>
</template>

<script>
export default {
  data() {
    return {
      simple: [
        {
          label: "Satisfied customers (with avatar)",
          avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
          children: [
            {
              label: "Good food (with icon)",
              icon: "restaurant_menu",
              children: [{ label: "Quality ingredients" }, { label: "Good recipe" }]
            },
            {
              label: "Good service (disabled node with icon)",
              icon: "room_service",
              children: [{ label: "Prompt attention" }, { label: "Professional waiter" }]
            },
            {
              label: "Pleasant surroundings (with icon)",
              icon: "photo",
              children: [
                {
                  label: "Happy atmosphere (with image)",
                  img: "https://cdn.quasar.dev/img/logo_calendar_128px.png"
                },
                { label: "Good table presentation" },
                { label: "Pleasing decor" }
              ]
            }
          ]
        }
      ],
      expanded: ["Satisfied customers (with avatar)", "Good food (with icon)"]
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
