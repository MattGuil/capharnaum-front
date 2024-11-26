<template>
    <div class="app-container">
      <!-- Barre de recherche -->
      <div class="search-bar">
        <v-icon class="filter-icon">mdi-tune</v-icon>
        <input type="text" placeholder="Rechercher une activité..." class="search-input" />
        <v-icon class="search-icon">mdi-magnify</v-icon>
      </div>
  
      <!-- Formulaire d'édition -->
      <main class="form-container">
        <h1>Modifier l'activité</h1>
        <form @submit.prevent="saveChanges">
          <label for="title">Titre</label>
          <input type="text" id="title" v-model="activity.title" placeholder="Modifier le titre..." />
  
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="activity.description"
            placeholder="Modifier la description..."
          ></textarea>
  
          <label for="category">Catégorie</label>
          <select id="category" v-model="activity.category">
            <option disabled value="">Sélectionner une catégorie...</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
  
          <label for="location">Lieu</label>
          <input type="text" id="location" v-model="activity.location" placeholder="Modifier le lieu..." />
  
          <label for="date">Date</label>
          <div class="date-container">
            <input type="date" id="date" v-model="activity.date" />
            <select v-model="activity.frequency">
              <option v-for="freq in frequencies" :key="freq" :value="freq">{{ freq }}</option>
            </select>
          </div>
  
          <label for="image">Image</label>
          <input type="file" id="image" @change="updateImage" />
  
          <button type="submit" class="submit-button">Sauvegarder les modifications</button>
        </form>
      </main>
  
      <!-- Footer similaire -->
      <footer class="footer">
        <button class="footer-button">Catalogue</button>
        <button class="footer-button active">Modifier</button>
        <button class="footer-button">Mon profil</button>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activity: {
          title: "JAM",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis imperdiet dolor nec convallis.",
          category: "PEINTURE",
          location: "8 Pl. du Griffon, 69001 Lyon",
          date: "2024-11-17",
          frequency: "Chaque semaine",
          image: null,
        },
        categories: ["PEINTURE", "MUSIQUE", "SPORT", "TECHNOLOGIE"],
        frequencies: ["Chaque jour", "Chaque semaine", "Chaque mois"],
      };
    },
    methods: {
      saveChanges() {
        console.log("Modifications sauvegardées :", this.activity);
      },
      updateImage(event) {
        const file = event.target.files[0];
        this.activity.image = file ? URL.createObjectURL(file) : null;
      },
    },
  };
  </script>
  
  <style scoped>
  /* Style global */
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(to bottom, #e3f2fd, #e8f5e9);
  }
  
  /* Barre de recherche */
  .search-bar {
    display: flex;
    align-items: center;
    background: linear-gradient(to right, #c0448f, #8e44ad);
    border-radius: 50px;
    padding: 8px 16px;
    width: 90%;
    max-width: 400px;
    margin: 20px auto;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .search-input {
    flex: 1;
    border: none;
    outline: none;
    padding: 8px;
    font-size: 14px;
    color: white;
    background: transparent;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .filter-icon,
  .search-icon {
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  /* Formulaire principal */
  .form-container {
    flex: 1;
    padding: 20px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
  
  h1 {
    font-size: 18px;
    margin-bottom: 16px;
    color: #333;
  }
  
  form label {
    display: block;
    margin-bottom: 4px;
    color: #555;
  }
  
  form input,
  form textarea,
  form select {
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
  }
  
  .date-container {
    display: flex;
    gap: 8px;
  }
  
  .submit-button {
    width: 100%;
    padding: 12px;
    background-color: #4a4a8f;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
  }
  
  /* Footer */
  .footer {
    display: flex;
    justify-content: space-around;
    padding: 10px;
    background-color: white;
    border-top: 1px solid #ccc;
  }
  
  .footer-button {
    background: none;
    border: none;
    font-size: 14px;
    padding: 8px;
    color: gray;
    cursor: pointer;
  }
  
  .footer-button.active {
    color: #4a4a8f;
    font-weight: bold;
  }
  </style>
  