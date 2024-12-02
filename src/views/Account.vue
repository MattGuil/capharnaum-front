<template>
    <v-icon @click="logout" class="btn-logout" color="white">mdi-logout</v-icon>
    <div class="profile-card">
        <div>
            <div class="profile-header">
                <div class="profile-image">
                    <img src="../assets/user.png" alt="Photo de profil">
                    <span class="rating">4.5</span>
                </div>
                <h3 v-if="user" >{{ user.prenom + " " + user.nom }}</h3>
                <p v-if="user" class="bio">{{ user.bio }}</p>
            </div>
            <div v-if="!itsMe" class="contacts">
                <v-icon color="blue-darken-2" icon="mdi-message-text-outline" size="24"></v-icon>
                <div class="action-buttons">
                    <v-btn @click="toggleFollow" class="follow-btn">
                        {{ isFollowed ? 'Following' : 'Follow' }}
                    </v-btn>
                </div>
                <v-icon color="blue-darken-2" icon="mdi-share-variant" size="24"></v-icon>
            </div>
        </div>
        <div class="stats">
            <div class="stat-item">
                <h4>{{ 0 }}</h4>
                <p>Activités</p>
            </div>
            <div class="stat-item">
                <h4>{{ 0 }}</h4>
                <p>Followers</p>
            </div>
            <div class="stat-item">
                <h4>{{ 0 }}</h4>
                <p>Following</p>
            </div>
        </div>
        <div v-if="user && user.interests.length > 0"  class="interests">
            <h4>Centres d’intérêt</h4>
            <div class="interest-cards">
                <div v-for="interest in user.interests" :key="interest" class="interest-card"></div>
            </div>
        </div>
        <div v-if="itsMe" class="buttons">
            <button @click="navigateToFavorites" class="profile-button">Mes favoris</button>
            <button class="profile-button">Mes activités</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

export default {
    name: 'Profile',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {

        const user = ref(null);

        const fetchUserData = async (userId) => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${userId}`);
                if (response.status === 200) {
                    user.value = response.data;
                    console.log(user);
                } else {
                    console.log("Erreur lors de la récupération de l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        };

        onMounted(() => {
            fetchUserData(props.id);
        });

        watch(
            () => props.id,
            (newId) => {
                fetchUserData(newId);
            }
        );

        return {
            user
        };
    },
    methods: {
        toggleFollow() {
            this.isFollowed = !this.isFollowed;
        },
        navigateToFavorites() {
            this.$router.push(`/profile/favorites`);
        },
        logout() {
            try {
                axios.get(`${import.meta.env.APP_API_URL}/user/logout`, { withCredentials: true })
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        localStorage.removeItem('userId');
                        this.$router.push('/login');
                    };
                });
            } catch (error) {
                console.log("Erreur lors de la déconnexion.");
            }
        }
    },
    computed: {
        itsMe() {
            return this.id == localStorage.getItem('userId');
        }
    }

};
</script>

<style scoped>
.btn-logout {
    position: absolute;
    top: 20px;
    right: 20px;
}

.profile-card {
    width: 100%;
    height: 80vh;
    padding: 20px;
    padding-top: 40px;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px 20px 0 0;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: absolute;
    bottom: 8vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.profile-header {
    position: relative;
    margin-bottom: 15px;
}

.profile-image {
    position: fixed;
    top: 5%;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    width: 80px;
    height: 80px;
    border-radius: 75%;
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
    z-index: 10;
    background: #4caf50;
    color: #fff;
    height: 28px;
    width: 28px;
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

.contacts {
    display: flex;
    justify-content: space-around;
    align-items: center;
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
