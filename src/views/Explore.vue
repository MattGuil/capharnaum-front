<template>
    <div id="explore-container">
        <maptiler 
            :activities="filteredActivities"
            id="map"
            @toggle-catalog="clickOnMap"
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
            :activities="filteredActivities"
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
        const filteredActivities = ref(null);
        const showCatalog = ref(false);

        const generateRandomColor = () => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            return randomColor;
        }

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity`);
                
                if (response.status === 200) {
                    activities.value = response.data;

                    activities.value.forEach(activity => {
                        activity.color = generateRandomColor();
                    })

                    filteredActivities.value = activities.value;
                    console.log(activities);
                } else {
                    console.log("Erreur lors de la récupération des activités");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        });

        const filterActivities = () => {
            if (!searchVal.value) {
                filteredActivities.value = activities.value;
            } else {
                filteredActivities.value = activities.value.filter(activity =>
                    activity.title.toLowerCase().includes(searchVal.value.toLowerCase())
                );
            }
        };

        return { searchVal, activities, showCatalog, filteredActivities, filterActivities };
    },
    methods: {
        clickOnKnob() {
            this.showCatalog = !this.showCatalog;
        },
        clickOnMap() {
            if (this.showCatalog) this.showCatalog = false;
        }
    }
};
</script>


<style scoped>

#explore-container {
    position: relative;
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
    border-radius: 10px 10px 0 0;
    background-color: rgba(255, 255, 255, .8);
    transition: all .5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#catalog.shown {
    height: 50%;
    overflow-y: auto;
}

#catalog.hidden {
    height: 35px;
}

</style>