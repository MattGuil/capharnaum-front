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
    <v-range-slider
        label="Prix"
        v-model="priceRangeComputed"
        step="1"
        max="50"
        min="0"
        thumb-label="always"
    ></v-range-slider>
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
import { ref, onMounted, computed } from 'vue';

export default {
    name: 'AdvancedFilters',

    setup() {

        const store = useStore();

        const isLoadingEnums = ref(true);       
        const disciplines = ref([]);
        const types = ref([]);
        const days = ref([]);

        const advancedFilters = ref({});

        const priceRangeComputed = computed({
            get() {
                console.log("GET");
                return advancedFilters.value.priceRange ? [advancedFilters.value.priceRange.min, advancedFilters.value.priceRange.max] : [0, 10];
            },
            set([min, max]) {
                console.log("SET");
                advancedFilters.value.priceRange = { min, max };
            }
        });

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
            advancedFilters,
            priceRangeComputed
        }
    },
    methods: {
        updateAdvancedFilters() {
            console.log(this.advancedFilters);
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
            this.$router.push('/explore');
        },
        resetAdvancedFilters() {
            delete this.advancedFilters.disciplines;
            delete this.advancedFilters.type;
            delete this.advancedFilters.priceRange;
            delete this.advancedFilters.days;
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
        }
    }

};

</script>

<style>

</style>