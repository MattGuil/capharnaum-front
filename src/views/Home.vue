<template>
    <div v-if="user && activitiesByUserInterest" class="home">
        <div class="header">
            <h1>Bienvenue {{ user.prenom }} !</h1>
            <h2>Ici, trouve des <strong>activités</strong> selon <br><strong>tes centres d'intérêts</strong> 😎</h2>
        </div>
        <div
            v-for="([discipline, activities], index) in Object.entries(activitiesByUserInterest)"
            :key="index"
            class="interest-ad"
        >
            <h3>{{ discipline.toUpperCase() }}</h3>
            <v-carousel
                height="200"
                cycle
                :show-arrows="false"
                hide-delimiter-background
                theme="dark"
            >
                <v-carousel-item
                    v-for="(activity, index) in activities"
                    :key="index"
                >
                    <activityCard
                        :key="activity.id" 
                        :activity="activity"
                        :isDistanceShown="true"
                    />
                </v-carousel-item>
            </v-carousel>
        </div>
    </div>
</template>

<script>
import activityCard from '../components/activityCard.vue';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useStore } from '../stores/store';

export default {
    name: 'Home',
    components: {
        activityCard
    },
    setup() {
        const store = useStore();
        const user = ref(null);

        const activitiesByUserInterest = ref({});

        const getUserLocation = async () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
                            store.updateUserLocation(location);
                            resolve(location);
                        },
                        (error) => {
                            console.error("Erreur de géolocalisation : ", error);
                            reject(error);
                        }
                    );
                } else {
                    const error = new Error("La géolocalisation n'est pas supportée par ce navigateur.");
                    console.error(error.message);
                    reject(error);
                }
            });
        };

        const calculateDistanceBetween = async (origin, destination) => {
            if (!origin || !destination) {
                // throw new Error("Origin ou destination invalide.");
                return;
            }

            const originFormatted =
                origin instanceof google.maps.LatLng
                    ? origin
                    : new google.maps.LatLng(origin.lat, origin.lng);

            const destinationFormatted =
                destination instanceof google.maps.LatLng
                    ? destination
                    : new google.maps.LatLng(destination.lat, destination.lng);

            return new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error("Timeout lors de l'appel à DistanceMatrixService."));
                }, 10000);

                new google.maps.DistanceMatrixService().getDistanceMatrix(
                    {
                        origins: [originFormatted],
                        destinations: [destinationFormatted],
                        travelMode: "DRIVING",
                    },
                    (response, status) => {
                        clearTimeout(timeout);
                        if (status === "OK") {
                            try {
                                const distance = response.rows[0].elements[0].distance.text;
                                const duration = response.rows[0].elements[0].duration.text;
                                resolve({ distance, duration });
                            } catch (err) {
                                reject(new Error("Erreur lors du traitement des données : " + err.message));
                            }
                        } else {
                            reject(new Error("Erreur lors du calcul de la distance : " + status));
                        }
                    }
                );
            });
        };

        const locationsAreEqual = (loc1, loc2, tolerance = 0.0001) => {
            if (!loc1 || !loc2) return false;
            const latDiff = Math.abs(loc1.lat - loc2.lat);
            const lngDiff = Math.abs(loc1.lng - loc2.lng);
            return latDiff <= tolerance && lngDiff <= tolerance;
        };

        const loadActivities = async () => {

            const currentLocation = await getUserLocation();
            console.log("USER LOCATION RETRIEVED");

            console.log("LOADING ACTIVITIES...");

            if (
                !store.lastUserLocation ||
                !locationsAreEqual(store.lastUserLocation, currentLocation)
            ) {
                store.updateUserLocation(currentLocation);
                store.resetDistanceCache();
                console.log('Position utilisateur mise à jour, réinitialisation du cache des distances.');
            }

            const newActivities = await store.refreshActivities();

            const distancePromises = store.activities.map(async (activity) => {
                if (!store.distanceCache[activity._id] || newActivities.includes(activity)) {
                    const distanceCalculationResponse = await calculateDistanceBetween(currentLocation, activity.coordinates);
                    const { distance, duration } = distanceCalculationResponse;
                    store.updateDistanceCache(activity._id, distance, duration);
                    activity.distance = distance;
                    activity.duration = duration;
                    console.log(`Distance calculée pour l'activité ${activity._id}:`, distance, duration);
                } else {
                    const { distance, duration } = store.distanceCache[activity._id];
                    activity.distance = distance;
                    activity.duration = duration;
                    console.log(`Distance récupérée du cache pour l'activité ${activity._id}`);
                }
            });

            await Promise.all(distancePromises);

            console.log("ACTIVITIES LOADED.");
        };

        const retrieveActivitiesByUserInterest = async () => {
            user.value.interests.forEach(async (interest) => {
                try {
                    const response = await axios.post(`${import.meta.env.APP_API_URL}/activity/filter/${store.userId}`, { disciplines: [interest] });
                    if (response.status === 200) {
                        activitiesByUserInterest.value[interest] = response.data;
                    } else {
                        console.error("Erreur lors de la récupération des activités");
                        activitiesByUserInterest.value[interest] = [];
                    }
                } catch (error) {
                    console.error("Erreur de connexion ou autre :", error);
                    activitiesByUserInterest.value[interest] = [];
                }
            });
        };

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${store.userId}`);
                if (response.status === 200) {
                    user.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération de l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

            await loadActivities();
            await retrieveActivitiesByUserInterest();

            console.log(activitiesByUserInterest);
        })

        return {
            user,
            activitiesByUserInterest
        }
    }
};
</script>

<style scoped>

.home {
    min-height: 100vh;
    background: rgba(255, 255, 255, .8) !important;  
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    padding-left: 40px;
    padding-right: 40px;
}

.header {
    margin: 40px 0;

    h2 {
        font-size: 1.25em;

        strong {
            font-style: italic;
        }
    }
}

.interest-ad {
    position: relative;
    width: 100%;
    margin: 10px 0;
}

h3 {
    z-index: 10;
    position: absolute;
    top: -40px;
    right: -10px;
    font-style: italic;
    background-color: #3c4798;
    color: white;
    padding: 10px;
    border-radius: 10px;
    transform: rotate(10deg);
}

</style>