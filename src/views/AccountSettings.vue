<template>
    <div class="edit-activity">
      <h1>Modifier l'Activité</h1>
      
      <form @submit.prevent="saveChanges">
        <div class="form-group">
          <label for="title">Titre</label>
          <input type="text" id="title" v-model="activity.title" />
        </div>
  
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" v-model="activity.description"></textarea>
        </div>
  
        <div class="form-group">
          <label for="category">Catégorie</label>
          <select id="category" v-model="activity.category">
            <option>Musique</option>
            <option>Peinture</option>
            <option>Céramique</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="location">Lieu</label>
          <input type="text" id="location" v-model="activity.location" />
        </div>
  
        <div class="form-group">
          <label for="date">Date</label>
          <input type="date" id="date" v-model="activity.date" />
        </div>
        
        <div class="form-group">
          <label for="frequency">Fréquence</label>
          <select id="frequency" v-model="activity.frequency">
            <option>Chaque semaine</option>
            <option>Chaque mois</option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="image">Modifier l'image</label>
          <input type="file" id="image" @change="onImageChange" />
        </div>
        
        <button type="submit">Sauvegarder les modifications</button>
      </form>
    </div>
  </template>
  

<script>
export default {
    name: 'AccountSettings',
    props: {},
    data() {
        return {
            activity: { title: 'JAM', 
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed convallis imperdiet dolor nec convallis. Ut sed dictum quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 
            category: 'Peinture', 
            location: '8 Pl. du Griffon, 69001 Lyon', 
            date: '2024-11-17', 
            frequency: 'Chaque semaine', 
            image: null }
        };
    },
    methods: {onImageChange(event) 
        { const file = event.target.files[0]; 
            if (file) { this.activity.image = URL.createObjectURL(file); } },
        }
};
</script>

<style scoped>
.edit-activity {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

textarea {
  resize: vertical;
}

button {
  background-color: #3f51b5;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #303f9f;
}
</style>
