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

    <v-date-input
        v-model="advancedFilters.dateRange.start"
        color="black"
        prepend-icon=""
        placeholder="Début"
    ></v-date-input>

    <v-date-input
        v-model="advancedFilters.dateRange.end"
        color="black"
        prepend-icon=""
        placeholder="Fin"
    ></v-date-input>

    <v-text-field
        v-model="advancedFilters.timeRange.start"
        label="Début"
        :active="startTimeMenu"
        @focus="startTimeMenu"
        readonly
    >
        <v-menu
            v-model="startTimeMenu"
            :close-on-content-click="true"
            activator="parent"
            transition="scale-transition"
        >
            <v-time-picker
                v-if="startTimeMenu"
                v-model="advancedFilters.timeRange.start"
                format="24hr"
                color="#3c4798"
                @close="startTimeMenu = false"
            ></v-time-picker>
        </v-menu>
    </v-text-field>

    <v-text-field
        v-model="advancedFilters.timeRange.end"
        label="Fin"
        :active="endTimeMenu"
        @focus="endTimeMenu"
        readonly
    >
        <v-menu
            v-model="endTimeMenu"
            :close-on-content-click="true"
            activator="parent"
            transition="scale-transition"
        >
            <v-time-picker
                v-if="endTimeMenu"
                v-model="advancedFilters.timeRange.end"
                format="24hr"
                color="#3c4798"
                @close="endTimeMenu = false"
            ></v-time-picker>
        </v-menu>
    </v-text-field>

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
import { ref, onBeforeMount, onMounted, computed, onUnmounted } from 'vue';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default {
    name: 'AdvancedFilters',
    components: {
        VDateInput, 
        VTimePicker
    },
    setup() {

        const store = useStore();

        const isLoadingEnums = ref(true);       
        const disciplines = ref([]);
        const types = ref([]);
        const days = ref([]);

        const advancedFilters = ref({});

        const startTimeMenu = ref(false);
        const endTimeMenu = ref(false);

        const priceRangeComputed = computed({
            get() {
                return (advancedFilters.value.priceRange && advancedFilters.value.priceRange.min && advancedFilters.value.priceRange.max) 
                    ? [advancedFilters.value.priceRange.min, advancedFilters.value.priceRange.max] 
                    : [0, 50];
            },
            set([min, max]) {
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
                advancedFilters.value = store.advancedFilters;
                if (!advancedFilters.value.dateRange) {
                    advancedFilters.value.dateRange = { start: null, end: null };
                }
                if (!advancedFilters.value.timeRange) {
                    advancedFilters.value.timeRange = { start: null, end: null };
                }
            }
        };

        onBeforeMount(() => {
            loadAdvancedFiltersFromStore();
        });

        onMounted(async () => {
            await fetchEnums();
        });

        onUnmounted(() => {
            if (!advancedFilters.value.dateRange.start && !advancedFilters.value.dateRange.end) {
                delete advancedFilters.value.dateRange;
            }
            if (!advancedFilters.value.timeRange.start && !advancedFilters.value.timeRange.end) {
                delete advancedFilters.value.timeRange;
            }
        })

        return {
            store,
            isLoadingEnums,
            disciplines,
            types,
            days,
            advancedFilters,
            priceRangeComputed,
            startTimeMenu,
            endTimeMenu
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
            this.advancedFilters = {
                dateRange: { start: null, end: null },
                timeRange: { start: null, end: null }
            };
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
        }
    }

};

</script>

<style>

</style>