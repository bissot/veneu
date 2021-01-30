<template>
  <nav id="navbar">
    <span id="nav-left"></span>
    <span id="nav-right">
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
  width: 100%;
  height: 3rem;
  margin-bottom: 0.5rem;
  background: none;
  box-shadow: 0rem -0.5rem 1rem 0.1rem;
}
#nav-right {
  float: right;
}
button {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
  height: 100%;
}
</style>
