<template>
    <div id="explore-container">
        <maptiler 
            id="map"
            ref="map"
            :activities="filteredActivitiesMap"
            @map-clicked="deselectActivity"
            @marker-clicked="filterActivitiesCatalog"
        />
        <div class="search-bar-container">
            <div class="search-bar">
                <v-icon class="filter-icon">mdi-tune</v-icon>
                <input type="text" placeholder="Recherche..." class="search-input" v-model="searchVal" />
                <v-icon class="search-icon" @click="filterActivities">mdi-magnify</v-icon>
            </div>
            <div class="chips">
                <v-chip
                    v-for="(filter, index) in formattedFilters"
                    :key="index"
                    :prepend-icon="filter.icon"
                    color="#3c4798"
                    closable
                    @click:close="removeFilter(filter)"
                >
                    {{ filter.text }}
                </v-chip>
            </div>
        </div>
        <catalog 
            :class="{ shown: showCatalog, hidden: !showCatalog, squeeze: (filteredActivitiesCatalog && filteredActivitiesCatalog.length == 1) }" 
            :activities="filteredActivitiesCatalog"
            id="catalog" 
            @toggle-catalog="clickOnKnob"
        />
    </div>
</template>

<script>
import { useStore } from '../stores/store';
import { ref, onMounted, watch, computed, onUnmounted } from 'vue';
import maptiler from '../components/map.vue';
import catalog from '../components/catalog.vue';
import { debounce } from 'lodash-es';

export default {
    name: 'Explore',
    components: {
        maptiler,
        catalog
    },
    setup() {

        const store = useStore();
        const userLocation = ref(null);
        const searchVal = ref('');
        const filteredActivitiesMap = ref(null);
        const filteredActivitiesCatalog = ref(null);
        const showCatalog = ref(false);
        const isActivitySelected = ref(false);
        const map = ref(null);

        const advancedFilters = ref({
            disciplines: [
                "danse"
            ]
        });

        const formattedFilters = computed(() => {
            const filters = [];

            if (advancedFilters.value.disciplines && advancedFilters.value.disciplines.length > 0) {
                advancedFilters.value.disciplines.forEach((discipline) => {
                    filters.push({
                        icon: null,
                        text: discipline,
                    });
                });
            }

            if (advancedFilters.value.type) {
                filters.push({
                    icon:
                        advancedFilters.value.type === "ponctuelle"
                        ? "mdi-pin"
                        : "mdi-refresh",
                    text: advancedFilters.value.type,
                });
            }

            if (advancedFilters.value.prix) {
                    const { min, max } = advancedFilters.value.prix;
                    const prixText = min === 0 && max === 0 ? "gratuit" : `${min} - ${max}`;
                    filters.push({
                        icon: "mdi-currency-eur",
                        text: prixText,
                });
            }

            if (advancedFilters.value.days && advancedFilters.value.days.length > 0) {
                advancedFilters.value.days.forEach((day) => {
                    filters.push({
                        icon: "mdi-calendar-blank",
                        text: day,
                    });
                });
            }

            if (advancedFilters.value.dateRange) {
                const { start, end } = advancedFilters.value.dateRange;
                const dateText = start === end ? start : `${start} - ${end}`;
                filters.push({
                    icon: "mdi-calendar-blank",
                    text: dateText,
                });
            }

            if (advancedFilters.value.timeRange) {
                const { start, end } = advancedFilters.value.timeRange;
                const timeText = start === end ? start : `${start} - ${end}`;
                filters.push({
                    icon: "mdi-clock-time-four",
                    text: timeText,
                });
            }

            return filters;
        });

        const removeFilter = (filter) => {

            if (advancedFilters.value.disciplines.includes(filter.text)) {
                advancedFilters.value.disciplines = advancedFilters.value.disciplines.filter(
                    (discipline) => discipline !== filter.text
                );
            } else if (filter.text === "ponctuelle" || filter.text === "regulière") {
                advancedFilters.value.type = null;
            } else if (filter.text.includes(" - ")) {
                if (filter.icon === "mdi-currency-eur") {
                    advancedFilters.value.prix = { min: null, max: null };
                } else if (filter.icon === "mdi-calendar-blank") {
                    advancedFilters.value.dateRange = { start: null, end: null };
                } else if (filter.icon === "mdi-clock-time-four") {
                    advancedFilters.value.timeRange = { start: null, end: null };
                }
            } else if (advancedFilters.value.days.includes(filter.text)) {
                advancedFilters.value.days = advancedFilters.value.days.filter(
                    (day) => day !== filter.text
                );
            }
        };

        const getUserLocation = () => {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const location = { lat: position.coords.latitude, lng: position.coords.longitude };
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
                return null;
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
                new google.maps.DistanceMatrixService().getDistanceMatrix(
                    {
                        origins: [originFormatted],
                        destinations: [destinationFormatted],
                        travelMode: 'DRIVING',
                    },
                    (response, status) => {
                        if (status === 'OK') {
                            const distance = response.rows[0].elements[0].distance.text;
                            const duration = response.rows[0].elements[0].duration.text;
                            resolve({ distance, duration });
                        } else {
                            console.error('Erreur lors du calcul de la distance : ', status);
                            reject(status);
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

            const currentLocation = userLocation.value;
            if (
                !store.lastUserLocation ||
                !locationsAreEqual(store.lastUserLocation, currentLocation)
            ) {
                console.log('Position utilisateur mise à jour, réinitialisation du cache des distances.');
                store.resetDistanceCache();
                store.updateUserLocation(currentLocation);
            }

            const newActivities = await store.refreshActivities(advancedFilters.value);

            console.log(advancedFilters.value);

            const distancePromises = store.activities.map(async (activity) => {
                if (!store.distanceCache[activity._id] || newActivities.includes(activity)) {
                    const { distance, duration } = await calculateDistanceBetween(userLocation.value, activity.coordinates);
                    store.updateDistanceCache(activity._id, distance, duration);
                    console.log(`Distance calculée pour l'activité ${activity._id}:`, distance, duration);
                } else {
                    console.log(`Distance récupérée du cache pour l'activité ${activity._id}`);
                }
            });

            await Promise.all(distancePromises);

            filteredActivitiesMap.value = store.activities;
            filteredActivitiesCatalog.value = store.activities;
        };

        const filterActivities = () => {
            if (!searchVal.value) {
                showCatalog.value = false;
                filteredActivitiesMap.value = store.activities;
                filteredActivitiesCatalog.value = store.activities;
            } else {
                filteredActivitiesMap.value = store.activities.filter(activity =>
                    activity.title.toLowerCase().includes(searchVal.value.toLowerCase())
                );
                filteredActivitiesCatalog.value = store.activities.filter(activity =>
                    activity.title.toLowerCase().includes(searchVal.value.toLowerCase())
                );
                showCatalog.value = true;
            }

            if (filteredActivitiesMap.value.length === 1) {
                const activity = filteredActivitiesMap.value[0];
                map.value.centerOnActivity(activity);
            }
        };

        onMounted(async () => {
            userLocation.value = await getUserLocation();
            await loadActivities();
        });

        onUnmounted(() => {
            console.log(store.activities);
        });

        const debouncedLoadActivities = debounce(async () => {
            await loadActivities();
        }, 300);

        watch(advancedFilters.value, () => {
                debouncedLoadActivities();
            },
            { deep: true }
        );

        watch(searchVal, () => {
            if (!searchVal.value) filterActivities();
        });

        return {
            store,
            userLocation,
            advancedFilters,
            formattedFilters,
            removeFilter,
            searchVal,
            showCatalog,
            isActivitySelected,
            filteredActivitiesMap,
            filteredActivitiesCatalog, 
            filterActivities,
            map
        };
    },
    methods: {
        clickOnKnob() {
            this.showCatalog = !this.showCatalog;
        },
        filterActivitiesCatalog(activitySelected) {
            const activities = this.store.activities;
            this.filteredActivitiesCatalog = activities.filter(activity =>
                activity._id == activitySelected._id
            );
            this.showCatalog = true;
            this.isActivitySelected = true;
        },
        deselectActivity() {
            if (this.isActivitySelected) {
                this.filterActivities();
                this.isActivitySelected = false;
            }
        }
    }
};
</script>


<style scoped>

#explore-container {
    position: relative;
    background: rgba(255, 255, 255, .8);
}

.search-bar-container {
    position: absolute;
    top: 10%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-bar {
    width: 90%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px;
    padding: 8px;
    max-width: 400px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.chips {
    width: 100%;
    padding: 0 5%;
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    gap: 5px;
    overflow-x: auto;
    white-space: nowrap;
    cursor: grab;
    scrollbar-width: none;
}

.v-chip {
    background-color: #3c4798 !important;
    color: white !important;
    flex-shrink: 0;
}

.search-input {
    flex-grow: 1;
    padding: 5px 10px;
    margin: 0 10px;
    font-size: 16px;
    border-radius: 4px;
}

.search-input:focus {
    outline: none;
}

#catalog {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px 10px 0 0;
    background-color: rgba(255, 255, 255, .8);
    transition: all .5s ease;
}

#catalog.shown {
    height: 50%;
    overflow-y: auto;
}

#catalog.shown.squeeze {
    height: 35%;
}

#catalog.hidden {
    height: 35px;
    overflow-y: hidden;
}

</style>