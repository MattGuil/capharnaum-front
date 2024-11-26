<template>

    <div class="search-bar">
        <v-icon class="filter-icon">mdi-tune</v-icon>
        <input type="text" placeholder="Recherche..." class="search-input" />
        <v-icon class="search-icon">mdi-magnify</v-icon>
     </div>

    <div class="profile-card">
        <h1>Profil</h1>
        
        <div class="profile-header">
            <div class="profile-image">
                <img src="https://via.placeholder.com/100" alt="Photo de profil">
                <span class="rating">4.5</span>
            </div>
            <h3>{{ userName }}</h3>
            <p class="bio">{{ bio }}</p>
            
            <div class="action-buttons">
                <v-btn @click="toggleFollow" class="follow-btn">
                    {{ isFollowed ? 'Following' : 'Follow' }}
                </v-btn>
            </div>
        </div>

        <!-- Updated Stats Section with Icons Above Labels -->
        <div class="stats">
            <div class="stat-item">
                <v-icon color="blue-darken-2" icon="mdi-message-text-outline" size="24"></v-icon>
                <h4>{{ events }}</h4>
                <p>Événements</p>
            </div>
            <div class="stat-item">
                <h4>{{ followers }}</h4>
                <p>Followers</p>
            </div>
            <div class="stat-item">
                <v-icon color="blue-darken-2" icon="mdi-share-variant" size="24"></v-icon>
                <h4>{{ following }}</h4>
                <p>Following</p>
            </div>
        </div>

        <div class="interests">
            <h4>Centres d’intérêt</h4>
            <div class="interest-cards">
                <div v-for="interest in interests" :key="interest" class="interest-card"></div>
            </div>
        </div>
        
        <div class="buttons">
            <button class="profile-button">Mes favoris</button>
            <button class="profile-button">Mes activités</button>
        </div>

       
    </div>
</template>

<script>
export default {
    name: 'Profile',
    data() {
        return {
            userName: "Ben Jabeur Jawher",
            bio: "My bio goes here...",
            followers: "XXXX",
            following: "XXXX",
            events: "XXX",
            isFollowed: false,
            interests: [1, 2, 3]
        };
    },
    methods: {
        toggleFollow() {
            this.isFollowed = !this.isFollowed;
        }
    }
};
</script>

<style scoped>
.profile-card {
    width: 100%;
    max-width: 400px;
    background: linear-gradient(to bottom, #e5efff, #f2e3ff);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: Arial, sans-serif;
    margin: 0 auto;
}

.profile-header {
    position: relative;
    margin-bottom: 15px;
}

.profile-image {
    position: relative;
    margin: 0 auto;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.profile-image img {
    width: 100%;
    height: 100%;
}

.rating {
    position: absolute;
    top: 0;
    right: 0;
    background: #4caf50;
    color: #fff;
    border-radius: 50%;
    padding: 5px;
    font-size: 12px;
    font-weight: bold;
}

h1, h3 {
    color: #333;
    margin: 5px 0;
}

.bio {
    color: #e57373;
    font-size: 14px;
    margin: 5px 0 15px;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 10px 0;
}

.follow-btn {
    background-color: #3f51b5;
    color: white;
    padding: 5px 10px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.stats {
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.stat-item h4 {
    color: #333;
    font-size: 16px;
    margin: 5px 0 0;
}

.stat-item p {
    color: #666;
    font-size: 12px;
    margin: 0;
}

.interests {
    margin-top: 15px;
    text-align: center;
}

.interests h4 {
    color: #333;
    font-size: 16px;
    margin-bottom: 10px;
}

.interest-cards {
    display: flex;
    justify-content: center;
    gap: 10px;
}

.interest-card {
    width: 70px;
    height: 80px;
    background: #bdbdbd;
    border-radius: 10px;
}

.buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.profile-button {
    background: #3f51b5;
    color: #fff;
    padding: 10px 0;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 200px;
    margin: 0 auto;
}

.bottom-nav {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    border-top: 1px solid #ccc;
    margin-top: 15px;
}

.bottom-nav v-icon {
    font-size: 24px;
    color: #3f51b5;
    cursor: pointer;
}

.search-bar {
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #b3305b, #c774c1);
  border-radius: 20px;
  padding: 8px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px auto;
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

</style>
