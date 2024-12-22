<template>
    <v-card v-if="activity" @click="clickCard">
        <h2 v-if="isDistanceShown && activity.maxParticipants - activity.nbParticipants > 0" class="distance">à <em>{{ store.getDistanceFor(activity._id).distance }}</em> de toi</h2>
        <h2 v-else-if="isDistanceShown && !(activity.maxParticipants - activity.nbParticipants > 0)" class="complet">COMPLET</h2>
        <i v-if="!isEditable" @click="updateFavorites($event)" :class="'mdi' + ' ' + (isFav ? 'mdi-heart' : 'mdi-heart-outline')"></i>
        <i v-else @click="updateActivity($event)" class="mdi mdi-pencil"></i>
        
        <img :src="srcImage" alt="">
        
        <div class="infos">
            <h1>{{ activity.title + " (" + (activity.price > 0 ? activity.price + "€" : "gratuit" ) + ")" }}</h1>
            <h2>{{ activity.placeName }}</h2>
            <h3>{{ activity.startTime + " - " + activity.endTime }}</h3>
        </div>
    </v-card>
</template>

<script>
import { useStore } from '../stores/store';
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';

export default {
    name: 'activityCard',
    props: {
        activity: {
            required: true
        },
        isDistanceShown: {
            required: true
        },
        isEditable: {
            required: false,
            default: false
        }
    },
    setup(props) {

        const store = useStore();

        const srcImage = ref('');
        const isFav = ref(false);
        
        const loadImage = () => {
            let imageSrc = '';
            try {
                imageSrc = new URL(`../assets/${props.activity.discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`, import.meta.url).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return imageSrc;
        }

        onMounted(async () => {
            srcImage.value = loadImage();

            try {
                const response = await axios.get(
                    `${import.meta.env.APP_API_URL}/favorite/check/${store.userId}/${props.activity._id}`
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

        
        watch(() => props.activity, () => {
            srcImage.value = loadImage();
        });
        
        return { store, srcImage, isFav };
    },
    methods: {
        clickCard() {
            this.$router.push(`/activity/${this.activity._id.toString()}`);
        },
        async updateFavorites(event) {
            
            event.stopPropagation();
            
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
        updateActivity(event) {
            
            event.stopPropagation();
            
            this.$router.push(`/manage/activity/${this.activity._id}`);
        }
    }
};
</script>

<style scoped>

.v-card {
    margin: 0;
    height: 150px;
    padding: 10px;
    background-color: white;
    color: black !important;
    border-radius: 10px;
    box-shadow: 0 5px 5px lightgray;
    cursor: pointer;
    display: flex;
}

img {
    width: 50%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

.infos {
    width: 50%;
    padding: 10px;
}

.infos {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

h1 {
    font-weight: bold;
    font-size: 1rem;
}

h2 {
    font-size: .75rem;
}

h3 {
    font-size: .5rem;
}

h2.distance, h2.complet {
    z-index: 100;
    position: absolute;
    top: 20px;
    left: 0;
    color: white;
    padding: 5px;
    border-radius: 0 5px 5px 0;
    box-shadow: 5px solid black;
}

h2.distance {
    background-color: #3c4798;
}

h2.complet {
    background-color: #D04E4E;
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