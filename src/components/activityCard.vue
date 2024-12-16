<template>
    <v-card @click="clickCard">
        <i @click="updateFavorites($event)" :class="'mdi' + ' ' + (isFav ? 'mdi-heart' : 'mdi-heart-outline')"></i>
        <img :src="srcImage" alt="">
        <div>

        </div>
        <div class="infos">
            <h1>{{ activity.title + " (" + activity.price + "€)" }}</h1>
            <h2>{{ activity.placeName }}<br>({{ store.getDistanceFor(activity._id).distance }})</h2>
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