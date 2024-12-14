<template>
    <h1>Filtres</h1>
    <v-autocomplete
        clearable
        chips
        label="Disciplines"
        v-model="advancedFilters.disciplines"
        :items="disciplines"
        multiple
    ></v-autocomplete>
    <v-radio-group 
        v-model="advancedFilters.type"
        label="Type d'activitié"
        inline
    >
        <v-radio v-for="type in types" :label="type" :value="type"></v-radio>
    </v-radio-group>
    <v-autocomplete
        clearable
        chips
        label="Jours de la semaine"
        v-model="advancedFilters.days"
        :items="days"
        multiple
    ></v-autocomplete>

    <v-btn
        variant="outlined"
        @click="resetAdvancedFilters()"
    >
        Effacer
    </v-btn>
    <v-btn
        variant="elevated"
        @click="updateAdvancedFilters()"
    >
        Appliquer
    </v-btn>
</template>

<script>
import axios from 'axios';
import { useStore } from '../stores/store';
import { ref, onMounted, watch } from 'vue';

export default {
    name: 'AdvancedFilters',

    setup() {

        const store = useStore();

        const isLoadingEnums = ref(true);       
        const disciplines = ref([]);
        const types = ref([]);
        const days = ref([]);

        const advancedFilters = ref({});

        const fetchEnums = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.APP_BACK_URL}/enums`);
                disciplines.value = Array.isArray(data.Disciplines)
                    ? data.Disciplines
                    : Object.values(data.Disciplines);

                types.value = Array.isArray(data.ActivityTypes)
                    ? data.ActivityTypes
                    : Object.values(data.ActivityTypes);

                days.value = Array.isArray(data.Days)
                    ? data.Days
                    : Object.values(data.Days);
            } catch (error) {
                errorMessage.value = "Erreur lors de la récupération des énumérés.";
                errorSnackbarVisible.value = true;
                console.error(error);
            } finally {
                isLoadingEnums.value = false;
            }
        };

        const loadAdvancedFiltersFromStore = () => {
            if (store.advancedFilters) {
                advancedFilters.value = { ...store.advancedFilters };
            }
        };

        onMounted(async () => {
            loadAdvancedFiltersFromStore();
            await fetchEnums();
        });

        return {
            store,
            isLoadingEnums,
            disciplines,
            types,
            days,
            advancedFilters
        }
    },
    methods: {
        updateAdvancedFilters() {
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
            this.$router.push('/explore');
        },
        resetAdvancedFilters() {
            this.advancedFilters.disciplines = [];
            this.advancedFilters.type = null;
            this.advancedFilters.days = [];
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
        }
    }

};

</script>

<style>

</style>