<template>
    <v-icon @click="toggleMenu" class="menu-button" color="white">mdi-menu</v-icon>
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

    <div class="profile-card">
        <div>
            <div class="profile-header">
                <div class="profile-image">
                    <img src="../assets/user.png" alt="Photo de profil">
                    <span class="rating">4.5</span>
                </div>
                <h3 v-if="user">{{ user.prenom + " " + user.nom }}</h3>
                <p v-if="user" class="bio">{{ user.bio }}</p>
            </div>
            <v-btn v-if="!itsMe" color="#3c4798">
                Envoyer un message
            </v-btn>
        </div>
        <div v-if="user && user.interests.length > 0" class="interests">
            <h4>Centres d’intérêt</h4>
            <div class="interest-cards">
                <div v-for="interest in user.interests" :key="interest" class="interest-card"></div>
            </div>
        </div>
        <v-card v-if="itsMe" class="mt-10" variant="outlined">
            <v-tabs
                v-model="tab"
                align-tabs="center"
                bg-color="transparent"
                stacked
            >
                <v-tab value="activities" class="tab-item">
                    <v-icon icon="mdi-head"></v-icon>
                    <div class="tab-text">
                        Activités ({{ activities ? activities.length : 0 }})
                    </div>
                </v-tab>
                <v-tab value="participations" class="tab-item">
                    <v-icon icon="mdi-note-edit"></v-icon>
                    <div class="tab-text">
                        Participations ({{ participations ? participations.length : 0 }})
                    </div>
                </v-tab>
                <v-tab value="favorites" class="tab-item">
                    <v-icon icon="mdi-heart"></v-icon>
                    <div class="tab-text">
                        Favoris ({{ favorites ? favorites.length : 0 }})
                    </div>
                </v-tab>
            </v-tabs>
            <v-card-text>
                <v-tabs-window v-model="tab">
                    <v-tabs-window-item value="activities" class="scrollable-container">
                        <div class="activity-cards-container">
                            <activityCard 
                                v-for="activity in activities" 
                                :key="activity.id" 
                                :activity="activity"
                            />
                        </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="participations" class="scrollable-container">
                        <div class="activity-cards-container">
                            <activityCard 
                                v-for="participation in participations" 
                                :key="participation.id" 
                                :activity="participation.activity"
                            />
                        </div>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="favorites" class="scrollable-container">
                        <div class="activity-cards-container">
                            <activityCard 
                                v-for="favorite in favorites" 
                                :key="favorite.id" 
                                :activity="favorite.activity"
                            />
                        </div>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import activityCard from '../components/activityCard.vue';
import { useStore } from '../stores/store';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

export default {
    name: 'Profile',
    components: {
        activityCard
    },
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {

        const menuVisible = ref(false);
        
        const store = useStore();
        const user = ref(null);
        const activities = ref(null);
        const participations = ref(null);
        const favorites = ref(null);
        const tab = ref(null);

        const fetchUserData = async (userId) => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${userId}`);
                if (response.status === 200) {
                    user.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération de l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
            
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/user/${userId}`);
                if (response.status === 200) {
                    activities.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération des activités animées par l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/participation/user/${userId}`);
                if (response.status === 200) {
                    participations.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération des activités animées par l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

            try {
				const response = await axios.get(`${import.meta.env.APP_API_URL}/favorite/user/${userId}`);
				if (response.status === 200) {
					favorites.value = response.data;
				} else {
					console.log("Erreur lors de la récupération des favoris")
				}
			} catch (error) {
				console.error("Erreur de connexion ou autre :", error);
			}
        };

        const toggleMenu = () => {
            menuVisible.value = !menuVisible.value;
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
            store,
            user,
            activities,
            participations,
            favorites,
            tab,
            menuVisible, // Ajouter le menu au retour
            toggleMenu,
        };
    },
    methods: {
        logout() {
            try {
                axios.get(`${import.meta.env.APP_API_URL}/user/logout`, { withCredentials: true })
                .then(res => {
                    console.log(res.status);
                    if (res.status === 200) {
                        this.store.resetStore();
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
            return this.id == this.store.userId;
        }
    }
};
</script>

<style scoped>

.menu-button {
    position: absolute;
    top: 20px;
    left: 20px;
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

.btn-logout {
    position: absolute;
    top: 20px;
    right: 20px;
}

.profile-card {
    width: 100%;
    height: 80vh;
    padding-top: 40px;
    background: rgba(255, 255, 255, 0.8);
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

.v-card {
    border: none;
    text-align: left;
}

.tab-item {
    font-size: .7rem;
}

.tab-text {
    margin-top: 4px;
}

.scrollable-container {
    max-height: 48vh;
    overflow-y: auto;
    scrollbar-width: none;
}

.activity-cards-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: .5em;
    padding: 10px;
}

</style>