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
                <v-icon class="filter-icon" @click="navigateToAdvancedFilters">mdi-tune</v-icon>
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
import { ref, onBeforeMount, onMounted, watch, computed } from 'vue';
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
        const searchVal = ref('');
        const filteredActivitiesMap = ref(null);
        const filteredActivitiesCatalog = ref(null);
        const showCatalog = ref(false);
        const isActivitySelected = ref(false);
        const map = ref(null);

        const advancedFilters = ref();

        const filterConfigs = [
            {
                key: "disciplines",
                icon: null,
                formatter: (value) => value,
                remover: (value, filter) => value.filter((item) => item !== filter.text),
            },
            {
                key: "type",
                icon: (value) => (value === "ponctuelle" ? "mdi-pin" : "mdi-refresh"),
                formatter: (value) => value,
                remover: () => undefined,
            },
            {
                key: "priceRange",
                icon: null,
                formatter: ({ min, max }) => {
                    if (min === 0 && max === 0) {
                        return "gratuit";
                    } else if (min !== null && max !== null && min === max) {
                        return `${min}€`;
                    } else if (min !== null && (max === null || max === 50)) {
                        return `à partir de ${min}€`;
                    } else if ((min === null || min === 0) && max !== null) {
                        return `jusqu'à ${max}€`;
                    } else {
                        return `${min}€ - ${max}€`;
                    }
                },
                remover: () => undefined,
            },
            {
                key: "days",
                icon: "mdi-calendar-blank",
                formatter: (value) => value,
                remover: (value, filter) => value.filter((day) => day !== filter.text),
            },
            {
                key: "dateRange",
                icon: "mdi-calendar-blank",
                formatter: ({ start, end }) => {
                    const formatDate = (date) => {
                        if (!date) return "";
                        const d = new Date(date);
                        return d.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });
                    };

                    const formattedStart = formatDate(start);
                    const formattedEnd = formatDate(end);

                    if (start && !end) {
                        return `à partir du ${formattedStart}`;
                    } else if (end && !start) {
                        return `jusqu'au ${formattedEnd}`;
                    } else if (formattedStart === formattedEnd) {
                        return formattedStart;
                    } else {
                        return `${formattedStart} - ${formattedEnd}`;
                    };
                },
                remover: () => undefined,
            },
            {
                key: "timeRange",
                icon: "mdi-clock-time-four",
                formatter: ({ start, end }) => {
                    if (start && !end) {
                        return `à partir de ${start}`;
                    } else if (end && !start) {
                        return `jusqu'à ${end}`;
                    } else if (start === end) {
                        return start;
                    } else {
                        return `${start} - ${end}`;
                    }
                },
                remover: () => undefined,
            },
        ];

        const formattedFilters = computed(() => {
            return filterConfigs.flatMap(({ key, icon, formatter }) => {
                const value = advancedFilters.value[key];
                if (!value || (Array.isArray(value) && value.length === 0)) return [];

                if (Array.isArray(value)) {
                    return value.map((item) => ({
                        icon: typeof icon === "function" ? icon(item) : icon,
                        text: formatter(item),
                        key,
                    }));
                } else {
                    return [
                        {
                            icon: typeof icon === "function" ? icon(value) : icon,
                            text: formatter(value),
                            key,
                        },
                    ];
                }
            });
        });

        const removeFilter = (filter) => {

            const config = filterConfigs.find(({ key }) => key === filter.key);
            if (!config) return;

            const value = advancedFilters.value[filter.key];
            const newValue = config.remover(value, filter);
            if (newValue === undefined) {
                delete advancedFilters.value[filter.key];
            } else {
                advancedFilters.value[filter.key] = newValue;
            }
            store.updateAdvancedFilters(advancedFilters.value);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
            debouncedLoadActivities();
        };

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
                    console.log(`Distance calculée pour l'activité ${activity._id}:`, distance, duration);
                } else {
                    console.log(`Distance récupérée du cache pour l'activité ${activity._id}`);
                }
            });

            await Promise.all(distancePromises);

            filteredActivitiesMap.value = store.activities;
            filteredActivitiesCatalog.value = store.activities;

            console.log("ACTIVITIES LOADED.");
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

        onBeforeMount(() => {
            if (store.advancedFilters) {
                advancedFilters.value = store.advancedFilters;
            }
        });

        onMounted(async () => {
            await loadActivities();
        });

        const debouncedLoadActivities = debounce(async () => {
            await loadActivities();
        }, 300);

        watch(searchVal, () => {
            if (!searchVal.value) filterActivities();
        });

        return {
            store,
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
        },
        navigateToAdvancedFilters() {
            this.$router.push('/advancedfilters');
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
    min-width: 90%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px;
    padding: 8px;
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