<template>
    <div id="explore-container">
        <maptiler 
            :activities="activities"
            id="map"
        />
        <catalog 
            :class="{ shown: showCatalog, hidden: !showCatalog }" 
            :activities="activities"
            id="catalog" 
            @click="toggleCatalog"    
        />
    </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
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
        const activities = ref(null);
        const showCatalog = ref(true);

        const toggleCatalog = (event) => {
            event.stopPropagation();
            showCatalog.value = !showCatalog.value;
        };

        const handleClickOutside = (event) => {
            const catalogElement = document.getElementById('catalog');
            if (catalogElement && !catalogElement.contains(event.target)) {
                showCatalog.value = false;
            }
        };

        onMounted(async () => {
            document.addEventListener('click', handleClickOutside);

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

        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
        });

        return { activities, showCatalog, toggleCatalog };
    }
};
</script>


<style scoped>

#explore-container {
    position: relative;
}

#catalog {
    width: 100%;
    position: absolute;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, .75);
    transition: all .5s ease;
}

#catalog.shown {
    top: 50%;
    height: 50%;
    overflow-y: auto;
}

#catalog.hidden {
    top: 89%;
    height: 11%;
}

</style>