<template>
    <v-main class="main-container">
        <div class="banner" :style="{ backgroundImage: `url(${srcImage})` }"></div>

        <v-card class="elevation-0 w-100 pa-10 card-container">
            <i @click="updateFavorites()" :class="'mdi' + ' ' + (isFav ? 'mdi-heart' : 'mdi-heart-outline')"></i>

            <h1 v-if="activity">{{ activity.title }}</h1>
            <h2 v-if="activity" class="event-title">{{ activity.placeName }}</h2>
            
            <div class="event-details">
                <div class="event-info">
                    <p v-if="activity">📍 {{ activity.address }}</p>
                    <p v-if="activity">⏰ {{ activity.startTime + ' - ' + activity.endTime }}</p>
                </div>

                <p v-if="activity" class="event-description">{{ activity.description }}</p>

                <div class="event-buttons">
                    <button class="btn btn-participate" @click="showPopup = true">
                        Je participe
                    </button>
                    <button class="btn btn-message">
                        Envoyer un message
                    </button>
                </div>

                <div class="social-actions">
                    <button @click="shareEvent" class="action-btn">
                        Partager
                    </button>
                    <button @click="commentEvent" class="action-btn">
                        Commenter <span class="badge">0</span>
                    </button>
                    <button @click="rateEvent" class="action-btn">
                        Noter <span class="rating">0</span>
                    </button>
                </div>
            </div>

            <v-snackbar v-model="snackbarVisible" :timeout="3000" location="bottom center" color="green">
                Vous êtes inscrit !
            </v-snackbar>
        </v-card>
    </v-main>

    <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
            <img :src="srcImage" alt="Illustration" class="popup-image" />
            <h2>Souhaitez-vous participer à {{ activity.title }} ?</h2>
            <div class="popup-buttons">
                <button class="participate" @click="handleParticipate">Je participe</button>
                <button class="cancel" @click="handleCancel">J’ai changé d’avis</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from '../stores/store';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: 'Activity',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {

        const store = useStore();

        const activity = ref(null);
        const srcImage = ref('');
        const isFav = ref(false);

        const showPopup = ref(false);
        
        const snackbarVisible = ref(false);

        const loadImage = () => {
            let imageSrc = '';
            try {
                imageSrc = new URL(
                    `../assets/${activity.value.discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`,
                    import.meta.url
                ).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return imageSrc;
        };

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/${props.id}`);
                console.log(response.data);
                if (response.status === 200) {
                    activity.value = response.data;
                } else {
                    console.log('Erreur lors de la récupération de l\'activité');
                }
            } catch (error) {
                console.error('Erreur de connexion ou autre :', error);
            }

            srcImage.value = loadImage();

            try {
                const response = await axios.get(
                    `${import.meta.env.APP_API_URL}/favorite/check/${store.userId}/${activity.value._id}`
                );
                
                if (response.status === 200) {
                    isFav.value = true;
                } else {
                    isFav.value = false;
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        });

        const handleParticipate = async () => {
            showPopup.value = false;
            try {
                const response = await axios.post(`${import.meta.env.APP_API_URL}/participation`, {
                    user: store.userId,
                    activity: activity.value._id
                });
                if (response.status === 201) {
                    snackbarVisible.value = true;
                } else {
                    this.errorMessage = "Erreur lors de la création de l'activité.";
                }
            } catch (error) {
                this.errorMessage = "Erreur de connexion ou autre.";
                console.error("Erreur lors de la création de l'activité", error);
            }
        };

        const handleCancel = () => {
            showPopup.value = false;
        };

        const shareEvent = () => {
            console.log("Partager l'événement");
            alert("L'événement a été partagé !");
        };

        const commentEvent = () => {
            console.log("Commenter l'événement");
            alert("Vous pouvez maintenant commenter cet événement.");
        };

        const rateEvent = () => {
            console.log("Noter l'événement");
            alert("Vous avez noté cet événement.");
        };

        return {
            store,
            activity,
            srcImage,
            isFav,
            showPopup,
            snackbarVisible,
            handleParticipate,
            handleCancel,
            shareEvent,
            commentEvent,
            rateEvent
        };
    },
    methods: {
        async updateFavorites() {
            try {
                let response;

                if (this.isFav) {
                    response = await axios.delete(
                        `${import.meta.env.APP_API_URL}/favorite/${this.store.userId}/${this.activity._id}`
                    );
                } else {
                    response = await axios.post(`${import.meta.env.APP_API_URL}/favorite`, {
                        user: this.store.userId,
                        activity: this.activity._id
                    });
                }

                if (response.status === 200 || response.status === 201) {
                    this.isFav = !this.isFav;
                } else {
                    console.log("Erreur lors de la mise à jour des favoris");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        }
    }
};
</script>


<style scoped>
.main-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f5f5f5;
    overflow: auto;
}

/* Section bannière */
.banner {
    width: 100%;
    height: 30vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* La carte */
.card-container {
    width: 100%;
    height: 80vh;
    background: rgba(255, 255, 255, 1);
    padding: 20px;
    z-index: 1;
    max-height: 100%;
    overflow-y: auto;
}

h1 {
    margin-bottom: 20px;
}

.event-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
}

.event-info p {
    margin: 5px 0;
    font-size: 14px;
}

.event-info a {
    color: #007BFF;
    text-decoration: none;
    font-weight: bold;
}

.event-info a:hover {
    text-decoration: underline;
}

.event-description {
    font-size: 14px;
    color: #555;
    margin: 15px 0;
    line-height: 1.6;
}

.event-buttons {
    display: flex;
    gap: 10px;
    margin: 15px 0;
}

.btn {
    flex: 1;
    padding: 10px 15px;
    font-size: 14px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn-participate {
    background-color: #34c759;
    color: white;
}

.btn-participate:hover {
    background-color: #28a745;
    transform: scale(1.05);
}

.btn-message {
    background-color: #007BFF;
    color: white;
}

.btn-message:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.btn i {
    margin-right: 8px;
    font-size: 16px;
}

/* Actions sociales */
.social-actions {
    display: none;
    /*
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    padding: 10px 0;
    font-size: 18px;
    color: #666;
    border-top: 1px solid #eee;
    */
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: none;
    color: #3b3b3b;
    font-size: 16px;
    cursor: pointer;
    transition: color 0.3s ease;
}

.action-btn:hover {
    color: #007BFF;
}

.action-btn .badge {
    background-color: #ff5722;
    color: white;
    padding: 0 8px;
    border-radius: 12px;
    font-size: 12px;
}

.action-btn .rating {
    font-size: 14px;
    color: #ff9800;
}

/* Style de l'arrière-plan du popup */
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

/* Style du popup */
.popup {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
}

.popup-image {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    border-radius: 5px;
}

.popup-buttons button {
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.participate {
    background-color: #a8df65;
    color: white;
}

.cancel {
    background-color: #e57373;
    color: white;
}

.mdi {
    position: absolute;
    top: 10px;
    right: 10px;
}

.mdi-heart-outline {
    color: black;
}

.mdi-heart {
    color: red;
}
</style>
