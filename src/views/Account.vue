<template>
    <v-icon @click="logout" class="btn-logout" color="white">mdi-logout</v-icon>
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
                <h4>{{ (activities) ? activities.length : 0 }}</h4>
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
        <div v-if="user && user.interests.length > 0" class="interests">
            <h4>Centres d’intérêt</h4>
            <div class="interest-cards">
                <div v-for="interest in user.interests" :key="interest" class="interest-card"></div>
            </div>
        </div>
        <div v-if="itsMe" class="tab-buttons">
            <button 
                v-for="(tab, index) in tabs" 
                :key="index" 
                :class="['tab-button', { active: activeTab === index }]" 
                @click="setActiveTab(index)">
                {{ tab }}
            </button>
        </div>
        <div class="tab-content">
            <div v-if="activeTab === 0" class="tab-pane">
                <h4>Animé</h4>
                <p>
                    "Animé" est l'onglet où vous pouvez découvrir des séries d'animation passionnantes. 
                    Explorez une variété d'animés allant des classiques comme *Naruto* aux dernières sorties. 
                    Un excellent endroit pour trouver des recommandations et partager vos coups de cœur !
                </p>
            </div>
            <div v-if="activeTab === 1" class="tab-pane">
                <h4>Inscrit</h4>
                <p>
                    L'onglet "Inscrit" est l'endroit où vous pouvez voir tous les événements auxquels vous êtes inscrit. 
                    Il peut s'agir de conférences, de meetups ou d'ateliers sur des sujets qui vous intéressent. 
                    Soyez à jour avec vos prochaines participations !
                </p>
            </div>
            <div v-if="activeTab === 2" class="tab-pane">
                <h4>Favoris</h4>
                <p>
                    Dans cet onglet, vous pouvez retrouver tous vos favoris : des articles intéressants, des vidéos inspirantes, 
                    ou même des blogs que vous aimez consulter régulièrement. C'est votre espace de partage de ressources utiles.
                </p>
            </div>
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
        const activities = ref(null);
        const activeTab = ref(0); // Onglet actif
        const tabs = ref(["Animé", "Inscrit", "Favoris"]); // Noms des onglets

        // Contenu exemple pour chaque onglet
        const sampleAnimes = ref([
            { id: 1, title: "Démon Slayer", description: "Combat contre des démons dans un monde fantastique." },
            { id: 2, title: "One Piece", description: "Luffy et son équipage à la recherche du One Piece." },
            { id: 3, title: "Naruto", description: "Les aventures d'un ninja courageux." }
        ]);

        const sampleEvents = ref([
            { id: 1, name: "Conférence Vue.js", date: "2024-01-15" },
            { id: 2, name: "Atelier Frontend", date: "2024-02-20" },
            { id: 3, name: "Meetup JavaScript", date: "2024-03-10" }
        ]);

        const sampleFavorites = ref([
            { id: 1, name: "Article Vue.js", details: "Guide complet sur Vue.js 3." },
            { id: 2, name: "Vidéo Frontend", details: "Tutoriel sur les composants réactifs." },
            { id: 3, name: "Blog DevOps", details: "Introduction aux outils CI/CD." }
        ]);

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
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity`, {
                    headers: {
                        'user-id': userId
                    }
                });
                if (response.status === 200) {
                    activities.value = response.data;
                    localStorage.setItem('activities', JSON.stringify(activities.value));
                } else {
                    console.log("Erreur lors de la récupération des activités de l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        };

        const setActiveTab = (index) => {
            console.log('Tab changé :', index);  // Debug
             activeTab.value = index;
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
            user,
            activities,
            activeTab,
            tabs,
            setActiveTab,
            sampleAnimes,
            sampleEvents,
            sampleFavorites
        };
    },
    methods: {
        toggleFollow() {
            this.isFollowed = !this.isFollowed;
        },
        logout() {
            try {
                axios.get(`${import.meta.env.APP_API_URL}/user/logout`, { withCredentials: true })
                .then(res => {
                    if (res.status === 200) {
                        localStorage.removeItem('userId');
                        this.$router.push('/login');
                    }
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

.tab-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.tab-button {
    flex: 1;
    padding: 10px 0;
    background: #c1ceee;
    border: none;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    color: #666;
    border-bottom: 2px solid transparent;
}

.tab-button.active {
    color: #3f51b5;
    border-bottom: 2px solid #3f51b5;
    background: #a1a1e7;
}

.tab-button:hover {
    background: #a1a1e7;
}
.tab-pane {
    display: block !important;
}
</style>
