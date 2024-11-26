<template>
    <div id="explore-container">
        <maptiler 
            :activities="activities"
            id="map"
            @toggle-catalog="clickOnMap"
        />
        <div class="search-bar-container">
            <div class="search-bar">
                <v-icon class="filter-icon">mdi-tune</v-icon>
                <input type="text" placeholder="Recherche..." class="search-input" v-model="searchVal" />
                <v-icon class="search-icon">mdi-magnify</v-icon>
            </div>
        </div>
        <catalog 
            :class="{ shown: showCatalog, hidden: !showCatalog }" 
            :activities="activities"
            id="catalog" 
            @toggle-catalog="clickOnKnob"    
        />
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
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
        const showCatalog = ref(false);

        watch(searchVal, (newVal) => {
            console.log('searchVal a changé :', newVal);
        });

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity`);
                
                if (response.status === 200) {
                    activities.value = response.data;
                    console.log(activities);
                } else {
                    console.log("Erreur lors de la récupération des activités");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        });

        return { searchVal, activities, showCatalog };
    },
    methods: {
        clickOnKnob() {
            console.log("KNOB CLICKED");
            this.showCatalog = !this.showCatalog;
        },
        clickOnMap() {
            console.log("MAP CLICKED");
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
    width: 100%;
    position: absolute;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, .8);
    transition: all .5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#catalog.shown {
    top: 50%;
    height: 50%;
    overflow-y: auto;
}

#catalog.hidden {
    top: 88vh;
    height: 12vh;
}

</style>