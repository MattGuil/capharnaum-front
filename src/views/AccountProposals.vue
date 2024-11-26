<template>
    <div class="app-container">
      <!-- Barre de recherche personnalisée -->
      <div class="search-bar">
        <v-icon class="filter-icon">mdi-tune</v-icon>
        <input type="text" placeholder="Recherche..." class="search-input" />
        <v-icon class="search-icon">mdi-magnify</v-icon>
      </div>
  
      <!-- Formulaire principal -->
      <main class="form-container">
        <h1>Appel à un nouveau projet</h1>
        <form @submit.prevent="submitForm">
          <label for="title">Titre</label>
          <input type="text" id="title" v-model="form.title" placeholder="Entrer un titre..." />
  
          <label for="description">Description</label>
          <textarea id="description" v-model="form.description" placeholder="Rédiger une description..."></textarea>
  
          <label for="category">Catégorie</label>
          <select id="category" v-model="form.category">
            <option disabled value="">Sélectionner une catégorie...</option>
            <option value="Tech">Tech</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
  
          <label for="date">Date</label>
          <div class="date-container">
            <input type="date" id="date" v-model="form.date" />
            <select v-model="form.frequency">
              <option value="Une fois">Une fois</option>
              <option value="Récurrent">Récurrent</option>
            </select>
          </div>
  
          <button type="submit" class="submit-button">Proposer le projet</button>
        </form>
      </main>
  
      <!-- Menu de navigation en bas -->
      <footer class="footer">
        <button class="footer-button">Catalogue</button>
        <button class="footer-button active">Créer</button>
        <button class="footer-button">Mon profil</button>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          title: "",
          description: "",
          category: "",
          date: "",
          frequency: "Une fois",
        },
      };
    },
    methods: {
      submitForm() {
        console.log("Formulaire soumis :", this.form);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Global container */
  
  
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
    background: white;
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
  