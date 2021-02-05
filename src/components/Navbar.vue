<template>
  <nav id="navbar">
    <span id="nav-left">
      <router-link :to="{ name: 'Dashboard' }"><button>Dashboard</button></router-link>
    </span>
    <span id="nav-right">
      <router-link :to="{ name: 'Voyager' }"><button>Voyager</button></router-link>
      <button v-if="isAuthenticated" id="logout" @click="handleLogout">
        Logout
      </button>
    </span>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      isAuthenticated: false
    };
  },
  watch: {
    $route(to, from) {
      this.setAuthentication();
    }
  },
  created() {
    this.setAuthentication();
  },
  methods: {
    setAuthentication() {
      this.isAuthenticated = localStorage.getItem("token");
    },
    handleLogout() {
      localStorage.removeItem("token");
      window.location.reload();
    }
  }
};
</script>

<style scoped>
#navbar {
  position: relative;
  margin: 1.5rem;
  width: calc(100% - 3rem);
  /* display: flex; */
  height: 3rem;
  padding: 0rem;
  background: none;
  align-items: flex-end;
  /* min-height: 3rem; */
  /* box-shadow: 0rem -0.5rem 1rem 0.1rem; */
  /* overflow: hidden; */
}
button {
  margin-top: 0;
  margin-bottom: 0;
  border-radius: 0rem;
  padding: 1rem 1.5rem;
  box-shadow: unset;
  height: 3rem;
}
#nav-left {
  float: left;
}
#nav-right {
  float: right;
}
#nav-left a:first-child button {
  margin-left: 0rem;
  border-radius: 0.75rem 0rem 0rem 1rem;
}
#nav-right a:last-child button,
#nav-right > button:last-child {
  margin-right: 0rem;
  border-radius: 0rem 1rem 1rem 0rem;
}
</style>
