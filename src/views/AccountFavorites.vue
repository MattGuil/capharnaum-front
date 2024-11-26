<template>
    <div>
      <div class="search-bar">
        <v-icon class="filter-icon">mdi-tune</v-icon>
        <input type="text" placeholder="Recherche..." class="search-input" />
        <v-icon class="search-icon">mdi-magnify</v-icon>
      </div>
  
      <div class="activity-list">
        <h2>Favoris</h2>
        <div class="activity-card" v-for="activity in activities" :key="activity.id">
          <img :src="activity.image" alt="Activity Image" class="activity-image" />
          <div class="activity-details">
            <h3>{{ activity.title }}</h3>
            <p><strong>Horaires:</strong> {{ activity.schedules }}</p>
            <p><strong>Adresse:</strong> {{ activity.address }}</p>
          </div>
          <v-icon class="favorite-icon">mdi-heart</v-icon>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        activities: [
          {
            id: 1,
            title: "MUSIQUE - JAM",
            schedules: "20h - 23h",
            address: "202 Crd Rue de la Guillotière, 69007 Lyon",
            image: "https://via.placeholder.com/100"
          },
          {
            id: 2,
            title: "PEINTURE - Café",
            schedules: "16h - 17h",
            address: "8 Pl. du Griffon, 69001 Lyon",
            image: "https://via.placeholder.com/100"
          },
          {
            id: 3,
            title: "CERCEAU - Aérien",
            schedules: "21h - 23h",
            address: "201 Av. Berthelot, 69007 Lyon",
            image: "https://via.placeholder.com/100"
          },
          {
            id: 4,
            title: "CROCHET - Café",
            schedules: "14h - 16h",
            address: "8 Pl. du Griffon, 69001 Lyon",
            image: "https://via.placeholder.com/100"
          }
        ]
      };
    }
  };
  </script>
  
  

  <style scoped>
  /* Utiliser le même gradient pour le fond */
  body {
    background: linear-gradient(to bottom, #e5efff, #f2e3ff);
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #b3305b, #c774c1);
    border-radius: 20px;
    padding: 8px;
    width: 100%;
    max-width: 400px;
    margin: 20px auto;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .search-input {
    flex-grow: 1;
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-size: 14px;
    padding: 5px 10px;
  }
  
  .filter-icon,
  .search-icon {
    color: white;
    font-size: 20px;
    cursor: pointer;
  }
  
  .search-icon {
    margin-left: auto;
  }
  
  .activity-list {
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .activity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease-in-out;
  }
  
  .activity-card:hover {
    transform: scale(1.05);
  }
  
  .activity-image {
    width: 100%;
    height: 150px;
    border-radius: 10px;
    margin-bottom: 15px;
    object-fit: cover;
  }
  
  .activity-details {
    text-align: center;
  }
  
  .activity-details h3 {
    margin: 0 0 10px;
    font-size: 18px;
    color: #333;
  }
  
  .activity-details p {
    margin: 5px 0;
    font-size: 14px;
    color: #666;
  }
  
  .favorite-icon {
    color: red;
    font-size: 24px;
    margin-top: 10px;
  }
  </style>
  