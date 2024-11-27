<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <router-view />
        <navbar v-if="shouldShowNavbar" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import navbar from './components/navbar.vue';

export default {
  name: 'App',
  components: {
    navbar,
  },
  computed: {
    shouldShowNavbar() {
      const noNavbarRoutes = ['/login', '/register'];
      return !noNavbarRoutes.includes(this.$route.path);
    },
  },
};
</script>

<style scoped>

</style>