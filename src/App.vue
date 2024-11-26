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

<!--

<template>
  <v-app>
    <v-main>
      <v-container fluid class="pa-0">
        <router-view />
        <navbar v-if="shouldShowNavbar" />
        
        <v-btn 
          v-if="shouldShowCatalogue" 
          icon 
          @click="toggleCatalogue" 
          class="catalogue-handle" 
          fab
          color="primary">
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>

        <transition name="slide-fade">
          <div v-if="isCatalogueOpen" class="catalogue-container">
            <div class="catalogue-content">
              <h3>Catalogue des Événements</h3>
              <p>Liste d'événements à venir...</p>
            </div>
          </div>
        </transition>

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
    shouldShowCatalogue() {
      // Show catalogue only on specific routes, e.g. /explore
      return this.$route.path === '/explore';
    }
  },
  data() {
    return {
      isCatalogueOpen: false,  // State of the catalogue (open/close)
    };
  },
  methods: {
    toggleCatalogue() {
      this.isCatalogueOpen = !this.isCatalogueOpen;
    }
  }
};
</script>

<style scoped>
.catalogue-handle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 60px; /* Positioning above the navbar */
  z-index: 10;
}

.catalogue-container {
  position: absolute;
  width: 100%;
  bottom: 56px; /* Just above the navbar */
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 5;
}

.catalogue-content {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

-->