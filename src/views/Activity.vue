<template>
    <div class="banner" :style="{ backgroundImage: `url(${srcImage})` }"></div>

    <v-card class="elevation-0 w-100 pa-10 card-container">
        <i @click="updateFavorites()" :class="'mdi' + ' ' + (isFav ? 'mdi-heart' : 'mdi-heart-outline')"></i>

        <h1 v-if="activity">{{ activity.title }}</h1>
        <div v-if="owner">
            <p>organisé par </p>
            <div class="owner-profile" @click="navigateToOwnerProfile()">
                <img src="../assets/user.png" alt="Photo de profil"> 
                <p>{{ owner.prenom }}</p>
            </div>
        </div>
        <h2 v-if="activity" class="event-title">{{ activity.placeName }}</h2>
        
        <div class="event-details">
            <div class="event-info">
                <p v-if="activity">📍 {{ activity.address }}</p>
                <p v-if="activity">⏰ {{ activity.startTime + ' - ' + activity.endTime }}</p>
            </div>

            <p v-if="activity" class="event-description">{{ activity.description }}</p>


            <div v-if="owner && owner._id != store.userId" class="event-buttons">
                
                <p v-if="activity" class="event-description">
                    <strong v-if="!isRegistered && activity.maxParticipants - activity.nbParticipants > 0">{{ remainingPlaces }} place(s) restante(s)</strong>
                    <strong v-else-if="!isRegistered && activity.maxParticipants - activity.nbParticipants == 0">Cet évènement est complet</strong>
                </p>
                
                <v-btn 
                    v-if="!isRegistered"
                    :disabled="!(activity.maxParticipants - activity.nbParticipants > 0)"
                    color="#3c4798"
                    prepend-icon="mdi-note-edit"
                    @click="showPopupParticipate = true"
                >
                    Je m'inscris
                </v-btn>
                <v-btn 
                    v-else 
                    class="lightcoral-btn"
                    @click="showPopupCancelParticipation = true"
                >
                    Annuler mon inscription
                </v-btn>
                <v-btn 
                    v-if="owner" 
                    class="btn-message"
                    prepend-icon="mdi-email"
                    @click="$router.push(`/conversation/${owner._id}`)"
                >
                    Ecrire à {{ owner.prenom }}
                </v-btn>
            </div>
            <div v-else class="event-buttons">
                <p>Tu es l'organisateur.trice de cet évènement</p>
                <v-btn
                    color="#3c4798"
                    prepend-icon="mdi-head"
                    @click="$router.push(`/profile/${store.userId}`)"
                >
                    Consulter mes activités
                </v-btn>
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
            {{ snackbarMessage }}
        </v-snackbar>
    </v-card>

    <div v-if="showPopupParticipate" class="popup-overlay">
        <div class="popup">
            <img :src="srcImage" alt="Illustration" class="popup-image" />
            <h2>Souhaitez-vous participer à "{{ activity.title }}" ?</h2>
            <div class="popup-buttons">
                <v-btn color="#3c4798" @click="handleParticipate">Je participe</v-btn>
                <v-btn class="lightcoral-btn" @click="handleCancel">J’ai changé d’avis</v-btn>
            </div>
        </div>
    </div>

    <div v-if="showPopupCancelParticipation" class="popup-overlay">
        <div class="popup">
            <img :src="srcImage" alt="Illustration" class="popup-image" />
            <h2>Souhaitez-vous vous désinscrire de "{{ activity.title }}" ?</h2>
            <div class="popup-buttons">
                <v-btn class="lightcoral-btn" @click="handleCancelParticipation">Je me désinscris</v-btn>
                <v-btn color="#3c4798" @click="handleCancel">J’ai changé d’avis</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from '../stores/store';
import { ref, onBeforeMount } from 'vue';
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
        const owner = ref(null);
        const srcImage = ref('');
        const isFav = ref(false);
        const isRegistered = ref(false);
        const remainingPlaces = ref(null);

        const showPopupParticipate = ref(false);
        const showPopupCancelParticipation = ref(false);

        const snackbarMessage = ref('');
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

        onBeforeMount(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/${props.id}`);
                if (response.status === 200) {
                    activity.value = response.data;
                    remainingPlaces.value = activity.value.maxParticipants - activity.value.nbParticipants;
                } else {
                    console.error('Erreur lors de la récupération de l\'activité');
                }
            } catch (error) {
                console.error(error);
            }

            srcImage.value = loadImage();

            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${activity.value.owner}`);
                if (response.status === 200) {
                    owner.value = response.data;
                } else {
                    console.error('Erreur lors de la récupération de l\'organisateur');
                }
            } catch (error) {
                console.error(error);
            }

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
                console.error(error);
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.APP_API_URL}/participation/check/${store.userId}/${activity.value._id}`
                );
                if (response.status === 200) {
                    isRegistered.value = true;
                } else {
                    isRegistered.value = false;
                }
            } catch (error) {
                console.error(error);
            }

        });

        const handleParticipate = async () => {
            showPopupParticipate.value = false;
            try {
                const response = await axios.post(`${import.meta.env.APP_API_URL}/participation`, {
                    user: store.userId,
                    activity: activity.value._id
                });
                if (response.status === 200) {
                    isRegistered.value = true;
                    snackbarMessage.value = "Vous êtes inscrit !";
                    snackbarVisible.value = true;
                    try {
                        const response = await axios.patch(`${import.meta.env.APP_API_URL}/activity/${activity.value._id}/increment-participants`);
                        if (response.status === 200) {
                            console.log("+1 participant");
                            remainingPlaces.value += 1;
                        } else {
                            console.error("Erreur lors de l'ajout d'un participant à l'activité");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    console.error("Erreur lors de l'inscription");
                }
            } catch (error) {
                console.error(error);
            }
        };

        const handleCancelParticipation = async () => {
            showPopupCancelParticipation.value = false;
            try {
                const response = await axios.delete(`${import.meta.env.APP_API_URL}/participation/${store.userId}/${activity.value._id}`);
                if (response.status === 200) {
                    isRegistered.value = false;
                    snackbarMessage.value = "Vous êtes désinscrit !";
                    snackbarVisible.value = true;
                    try {
                        const response = await axios.patch(`${import.meta.env.APP_API_URL}/activity/${activity.value._id}/decrement-participants`);
                        if (response.status === 200) {
                            console.log("-1 participant");
                            remainingPlaces.value -= 1;
                        } else {
                            console.error("Erreur lors du retrait d'un participant de l'activité");
                        }
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    console.error("Erreur lors de la désinscription");
                }
            } catch (error) {
                console.error(error);
            }
        };

        const handleCancel = () => {
            showPopupParticipate.value = false;
            showPopupCancelParticipation.value = false;
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
            owner,
            srcImage,
            isFav,
            isRegistered,
            remainingPlaces,
            showPopupParticipate,
            showPopupCancelParticipation,
            snackbarMessage,
            snackbarVisible,
            handleParticipate,
            handleCancelParticipation,
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
        },
        navigateToOwnerProfile() {
            this.$router.push(`/profile/${this.owner._id}`);
        }
    }
};
</script>

<style scoped>

.v-container {
    position: relative;
}

.banner {
    position: fixed;
    width: 100%;
    height: 30vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.card-container {
    z-index: 1;
    position: absolute;
    width: 100%;
    bottom: 8vh;
    height: 70vh;
    background: rgba(255, 255, 255, 1);
    padding: 20px;
    border-radius: 20px 20px 0 0;
    overflow-y: auto;
}

h1 {
    margin-bottom: 0;
}

h1 + div {
    display: flex;
}

.owner-profile {
    display: flex;
    cursor: pointer;
    height: 30px;
}

.owner-profile img {
    height: 80%;
    margin-left: 5px;
}

.owner-profile p {
    margin: 0;
    margin-left: 5px;
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
    flex-direction: column;
    gap: 10px;
    margin: 15px 0;
    text-align: center;
}

.event-buttons p {
    margin: 0;
}

.btn-message {
    background-color: #3c4798;
    color: white;
}

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

.popup-buttons .v-btn {
    width: 100%;
    padding: 10px 20px;
    margin: 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.lightcoral-btn {
    background-color: lightcoral;
    color: white;
}

.mdi {
    position: absolute;
    top: 20px;
    right: 20px;
}

.mdi-heart-outline {
    color: black;
}

.mdi-heart {
    color: red;
}

</style>
