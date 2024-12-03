<template>
    <v-main class="main-container">
        <!-- Section avec l'image en haut -->
        <div class="banner" :style="{ backgroundImage: `url(${srcImage})` }"></div>

        <!-- La carte en dessous -->
        <v-card class="elevation-0 w-100 pa-10 card-container">
            <h1 v-if="activity">{{ activity.title }}</h1>
            
            <!-- Informations de l'événement -->
            <div class="event-details">
                <h2 class="event-title">{{ event.title }}</h2>

                <div class="event-info">
                    <p>
                        📍 <a :href="event.locationUrl" target="_blank">
                            {{ event.location }}
                        </a>
                    </p>
                    <p>⏰ {{ event.time }}</p>
                </div>

                <!-- Description -->
                <p class="event-description">{{ event.description }}</p>

                <!-- Boutons d'interaction -->
                <div class="event-buttons">
                    <button class="btn btn-participate" @click="showPopup = true">
                        <i class="fas fa-check-circle"></i> Je participe
                    </button>
                    <button class="btn btn-message">
                        <i class="fas fa-envelope"></i> Envoyer un message
                    </button>
                </div>

                <!-- Actions sociales -->
                <div class="social-actions">
                    <button @click="shareEvent" class="action-btn">
                        <i class="fas fa-paper-plane"></i> Partager
                    </button>
                    <button @click="commentEvent" class="action-btn">
                        <i class="fas fa-comment-dots"></i> Commenter <span class="badge">{{ event.commentsCount }}</span>
                    </button>
                    <button @click="rateEvent" class="action-btn">
                        <i class="fas fa-star"></i> Noter <span class="rating">{{ event.rating }}</span>
                    </button>
                </div>
            </div>
        </v-card>
    </v-main>

    <!-- Popup -->
    <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
            <img :src="srcImage" alt="Illustration" class="popup-image" />
            <h2>Souhaitez-vous participer à {{ event.title }} ?</h2>
            <div class="popup-buttons">
                <button class="participate" @click="handleParticipate">Je participe</button>
                <button class="cancel" @click="handleCancel">J’ai changé d’avis</button>
            </div>
        </div>
    </div>
</template>

<script>
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
        const activity = ref(null);
        const srcImage = ref('');
        const event = ref({
            title: 'GROUPE DE DANSE - Confluence',
            location: '86 Quai Perrache, 69002 Lyon',
            locationUrl: 'https://maps.google.com?q=86+Quai+Perrache,+69002+Lyon',
            time: '18h - 21h',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            commentsCount: 17,
            rating: '4/5',
        });

        const showPopup = ref(false);

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
                console.log(response.data);  // Vérifiez les données
                if (response.status === 200) {
                    activity.value = response.data;
                } else {
                    console.log('Erreur lors de la récupération de l\'activité');
                }
            } catch (error) {
                console.error('Erreur de connexion ou autre :', error);
            }

            srcImage.value = loadImage();
            console.log(srcImage.value); // Vérifiez l'URL de l'image
        });

        const handleParticipate = () => {
            console.log("Vous participez à l'événement.");
            alert("Merci pour votre participation !");
            showPopup.value = false;
        };

        const handleCancel = () => {
            console.log("Participation annulée.");
            alert("Vous avez changé d’avis.");
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
            activity,
            srcImage,
            event,
            showPopup,
            handleParticipate,
            handleCancel,
            shareEvent,
            commentEvent,
            rateEvent
        };
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
    border-bottom: 5px solid rgba(0, 0, 0, 0.1);
}

/* La carte */
.card-container {
    width: 80%;
    max-width: 600px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 20px;
    margin-top: -10vh;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1;
    max-height: 100%;
    overflow-y: auto;
}

h1 {
    margin-bottom: 20px;
    text-align: center;
}

.event-details {
    padding: 20px;
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
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    padding: 10px 0;
    font-size: 18px;
    color: #666;
    border-top: 1px solid #eee;
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
</style>
