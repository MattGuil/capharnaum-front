<template>
    <div id="explore-container">
        <maptiler 
            :activities="filteredActivitiesMap"
            id="map"
            @activity-selected="filterActivitiesCatalog"
        />
        <div class="search-bar-container">
            <div class="search-bar">
                <v-icon class="filter-icon">mdi-tune</v-icon>
                <input type="text" placeholder="Recherche..." class="search-input" v-model="searchVal" />
                <v-icon class="search-icon" @click="filterActivities">mdi-magnify</v-icon>
            </div>
        </div>
        <catalog 
            :class="{ shown: showCatalog, hidden: !showCatalog }" 
            :activities="filteredActivitiesCatalog"
            id="catalog" 
            @toggle-catalog="clickOnKnob"    
        />
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import maptiler from '../components/map.vue';
import catalog from '../components/catalog.vue';
import axios from 'axios';

export default {
    name: 'Explore',
    components: {
        maptiler,
        catalog
    },
    setup() {
        
        let searchVal = ref('');

        const activities = ref(null);
        const filteredActivitiesMap = ref(null);
        const filteredActivitiesCatalog = ref(null);

        const showCatalog = ref(false);

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity`);
                
                if (response.status === 200) {
                    activities.value = response.data;
                    filteredActivitiesMap.value = activities.value;
                    filteredActivitiesCatalog.value = activities.value;
                } else {
                    console.log("Erreur lors de la récupération des activités");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        });

        const filterActivities = () => {
            if (!searchVal.value) {
                filteredActivitiesMap.value = activities.value;
                filteredActivitiesCatalog.value = activities.value;
            } else {
                filteredActivitiesMap.value = activities.value.filter(activity =>
                    activity.title.toLowerCase().includes(searchVal.value.toLowerCase())
                );
                filteredActivitiesCatalog.value = activities.value.filter(activity =>
                    activity.title.toLowerCase().includes(searchVal.value.toLowerCase())
                );
            }
        };

        watch(searchVal, () => {
            if (!searchVal.value) filterActivities();
        });

        return { 
            activities,
            searchVal,
            showCatalog,
            filteredActivitiesMap,
            filteredActivitiesCatalog, 
            filterActivities
        };
    },
    methods: {
        clickOnKnob() {
            this.showCatalog = !this.showCatalog;
        },
        filterActivitiesCatalog(activitySelected) {
            this.filteredActivitiesCatalog = this.activities.filter(activity =>
                activity._id == activitySelected._id
            );
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
    top: 0;
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
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

#catalog.hidden {
    height: 35px;
    overflow-y: hidden;
}

</style>