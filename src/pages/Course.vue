<template>
  <ApolloQuery :query="require('../graphql/Course.gql')" :variables="{ _id: $route.params._id }">
    <template slot-scope="{ result: { loading, error, data } }">
      <div v-if="loading">Loading...</div>
      <div v-if="error">Error...</div>
      <div v-if="data" class="row q-px-md" id="courseloaded">
        <div class="col-12 col-md-6 q-px-sm">
          <h1>{{ data.course.name }}</h1>
          More info about the course
          <h2>Resources</h2>
          <q-tree :nodes="simple" accordion node-key="label" :expanded.sync="expanded" />
        </div>
        <!-- <q-separator v-if="!($q.screen.lt.sm || $q.screen.lt.md)" vertical spaced="-1px" inset /> -->
        <q-timeline
          id="timeline"
          class="col-12 col-md-6 q-px-sm"
          :layout="$q.screen.lt.sm ? 'dense' : $q.screen.lt.md ? 'comfortable' : 'comfortable'"
          color="primary"
        >
          <q-timeline-entry heading>
            Timeline heading
            <br />
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="left">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 21, 1986" side="right" icon="delete">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry heading>November, 2017</q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="left">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="right">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="left" color="orange" icon="done_all">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="right">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>

          <q-timeline-entry title="Event Title" subtitle="February 22, 1986" side="left">
            <div>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </div>
          </q-timeline-entry>
        </q-timeline>
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
  }
};
</script>

<style scoped>
.col-12 {
  overflow: auto;
}
</style>
