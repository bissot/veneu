<template>
  <q-page id="dashboard" class="q-pb-md">
    <q-tabs color="primary" v-model="tab" align="justify" indicator-color="transparent" active-color="secondary">
      <q-tab name="calendar" label="Calendar" class="q-mr-sm q-ml-md q-mt-md q-mb-sm" />
      <q-tab name="timeline" label="Timeline" class="q-mx-sm q-mt-md q-mb-sm" />
      <q-tab name="resource" label="Resource" class="q-mr-md q-ml-sm q-mt-md q-mb-sm" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="calendar" class="row full-width q-py-sm q-px-md">
        <h1 class="full-width q-py-xs">Calendar</h1>
        <div class="row full-width justify-between items-center q-my-md">
          <q-btn flat label="Prev" @click="calendarPrev" class="q-mr-md" />
          <q-btn flat label="Next" @click="calendarNext" />
        </div>
        <q-calendar
          ref="calendar"
          v-model="selectedDate"
          view="week"
          locale="en-us"
          style="height: 100%;"
          color="primary"
          transition-prev="slide-right"
          transition-next="slide-left"
          class="neu-convex q-pa-xs"
        />
      </q-tab-panel>

      <q-tab-panel name="timeline" class="row full-width q-py-sm q-px-md">
        <div class="neu-convex full-width q-pa-md">
          <div class="text-h6">Timeline View</div>
          Coming soon
        </div>
      </q-tab-panel>

      <q-tab-panel name="resource" class="row full-width q-py-sm q-px-md">
        <div class="neu-convex full-width q-pa-md">
          <div class="text-h6">Resource View</div>
          Coming soon
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
export default {
  name: "Dashboard",
  props: {
    me: Object
  },
  data() {
    return {
      tab: "calendar",
      selectedDate: ""
    };
  },
  created() {},
  methods: {
    calendarNext() {
      this.$refs.calendar.next();
    },
    calendarPrev() {
      this.$refs.calendar.prev();
    }
  }
};
</script>

<style scoped></style>
