<template>
    <!-- Bouton pour ouvrir le menu -->
    <v-icon @click="toggleMenu" class="menu-button" color="blue-darken-2">mdi-menu</v-icon>
    <v-icon @click="logout" class="btn-logout" color="white">mdi-logout</v-icon>
  
    <!-- Menu latéral -->
    <transition name="slide">
      <div v-if="menuVisible" class="menu-container">
        <div class="menu">
          <v-icon @click="toggleMenu" class="close-button" color="red">mdi-close</v-icon>
  
          <h3>Paramètres</h3>
          <ul>
            <li>
              <v-icon color="blue-darken-2">mdi-account</v-icon>
              <span>Détails du compte</span>
            </li>
            <li>
              <v-icon color="blue-darken-2">mdi-bell</v-icon>
              <span>Notifications</span>
            </li>
          </ul>
  
          <h3>Assistance</h3>
          <ul>
            <li>
              <v-icon color="blue-darken-2">mdi-help-circle</v-icon>
              <span>Centre d’aide</span>
            </li>
            <li>
              <v-icon color="blue-darken-2">mdi-file-document</v-icon>
              <span>Conditions d’utilisation</span>
            </li>
            <li>
              <v-icon color="blue-darken-2">mdi-lock</v-icon>
              <span>Politique de confidentialité</span>
            </li>
            <li>
              <v-icon color="blue-darken-2">mdi-information</v-icon>
              <span>À propos</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  import axios from "axios";
  import { ref, onMounted, watch } from "vue";
  
  export default {
    name: "Profile",
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const user = ref(null);
      const activities = ref(null);
      const menuVisible = ref(false);
  
      // Fonction pour récupérer les données de l'utilisateur
      const fetchUserData = async (userId) => {
        try {
          const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${userId}`);
          if (response.status === 200) {
            user.value = response.data;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des données utilisateur :", error);
        }
      };
  
      // Fonction pour basculer la visibilité du menu
      const toggleMenu = () => {
        menuVisible.value = !menuVisible.value;
      };
  
      // Récupérer les données utilisateur au montage
      onMounted(() => {
        fetchUserData(props.id);
      });
  
      // Surveiller les changements de l'ID utilisateur
      watch(
        () => props.id,
        (newId) => {
          fetchUserData(newId);
        }
      );
  
      return {
        user,
        activities,
        menuVisible,
        toggleMenu,
      };
    },
    methods: {
      // Fonction de déconnexion
      async logout() {
        try {
          const res = await axios.get(`${import.meta.env.APP_API_URL}/user/logout`, { withCredentials: true });
          if (res.status === 200) {
            localStorage.removeItem("userId");
            this.$router.push("/login");
          }
        } catch (error) {
          console.error("Erreur lors de la déconnexion :", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .menu-button {
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
  }
  
  .btn-logout {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }
  
  .menu-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100%;
    background-color: white;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
  
  .menu {
    padding: 20px;
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  
  h3 {
    color: #333;
    margin-bottom: 10px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  v-icon {
    margin-right: 10px;
    cursor: pointer;
  }
  </style>
  