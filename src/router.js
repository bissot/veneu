import Vue from "vue";
import Router from "vue-router";

import AdminOverview from "./components/AdminOverview";
import AdminUsers from "./components/AdminUsers";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/admin",
      component: AdminOverview
    },
    {
      path: "/admin/users",
      component: AdminUsers
    }
  ],
  mode: "history"
});
