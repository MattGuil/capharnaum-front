<template>
    <v-card class="elevation-0 w-100 pa-10">
        <h1>Filtres avancés</h1>

        <fieldset>
            <legend>Disciplines</legend>
            <v-autocomplete
                clearable
                chips
                v-model="advancedFilters.disciplines"
                variant="solo"
                :items="disciplines"
                multiple
            >
                <template v-slot:chip>
                    <v-chip class="custom-chip"></v-chip>
                </template>
            </v-autocomplete>
        </fieldset>

        <fieldset>
            <div class="restore">
                <legend>Type d'activité</legend>
                <v-btn variant="plain" class="restore-btn" @click="resetFilter('type')">
                    <v-icon icon="mdi-restore"></v-icon>
                </v-btn>
            </div>
            <v-radio-group 
                v-model="advancedFilters.type"
                inline
            >
                <v-radio v-for="type in types" :label="type" :value="type"></v-radio>
            </v-radio-group>
        </fieldset>

        <fieldset>
            <div class="restore">
                <legend>Prix</legend>
                <v-btn variant="plain" class="restore-btn" @click="resetFilter('priceRange')">
                    <v-icon icon="mdi-restore"></v-icon>
                </v-btn>  
            </div>
            <v-range-slider
                v-model="priceRangeComputed"
                step="1"
                max="50"
                min="0"
                thumb-label="always"
            >
                <template v-slot:thumb-label="{ modelValue }">
                    {{ modelValue + "€" }}
                </template>
            </v-range-slider>
        </fieldset>

        <fieldset>
            <legend>Jours de la semaine</legend>
            <v-autocomplete
                clearable
                chips
                v-model="advancedFilters.days"
                variant="solo"
                :items="days"
                multiple
            >
                <template v-slot:chip>
                    <v-chip class="custom-chip"></v-chip>
                </template>
            </v-autocomplete>
        </fieldset>

        <fieldset>
            <div class="restore">
                <legend>Période</legend>
                <v-btn variant="plain" class="restore-btn" @click="resetFilter('dateRange')">
                    <v-icon icon="mdi-restore"></v-icon>
                </v-btn>  
            </div>
            <div class="date-range-inputs">
                <v-date-input
                    v-model="advancedFilters.dateRange.start"
                    variant="solo"
                    color="black"
                    prepend-icon=""
                    placeholder="Début"
                ></v-date-input>

                <v-date-input
                    v-model="advancedFilters.dateRange.end"
                    variant="solo"
                    color="black"
                    prepend-icon=""
                    placeholder="Fin"
                ></v-date-input>
            </div>
        </fieldset>

        <fieldset>
            <div class="restore">
                <legend>Période horaire</legend>
                <v-btn variant="plain" class="restore-btn" @click="resetFilter('timeRange')">
                    <v-icon icon="mdi-restore"></v-icon>
                </v-btn>  
            </div>
            <div class="time-range-inputs">
                <v-text-field
                    v-model="advancedFilters.timeRange.start"
                    variant="solo"
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
                    variant="solo"
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
            </div>
        </fieldset>

        <div class="buttons">
            <v-btn
                variant="outlined"
                @click="resetAdvancedFilters()"
            >
                Effacer
            </v-btn>
            <v-btn
                variant="elevated"
                color="#3c4798"
                @click="apply()"
            >
                Appliquer
            </v-btn>
        </div>
    </v-card>
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
                return (advancedFilters.value.priceRange && advancedFilters.value.priceRange.min != null && advancedFilters.value.priceRange.max != null) 
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
            if (advancedFilters.value.priceRange && advancedFilters.value.priceRange.min == 0 && advancedFilters.value.priceRange.max == 50) {
                delete advancedFilters.value.priceRange;
            }
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
            this.store.updateAdvancedFilters(this.advancedFilters);
            console.log("ADVANCED FILTERS UPDATED IN THE STORE.");
        },
        resetFilter(filterName) {
            if (filterName == 'dateRange' || filterName == 'timeRange') {
                this.advancedFilters[filterName] = { start: null, end: null };
            } else if (filterName == 'priceRange') {
                this.advancedFilters[filterName] = { min: 0, max: 50 };
            } else if (filterName == 'type') {
                delete this.advancedFilters[filterName];
            }
            this.updateAdvancedFilters();
        },
        resetAdvancedFilters() {
            this.advancedFilters = {
                dateRange: { start: null, end: null },
                timeRange: { start: null, end: null }
            };
            this.updateAdvancedFilters();
        },
        apply() {
            this.updateAdvancedFilters();
            this.$router.push('/explore');
        },
    }

};

</script>

<style scoped>

.v-card {
    width: 100%;
    margin-top: 12vh;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px 20px 0 0;
}

h1 {
    margin-bottom: 25px;
}

fieldset div.restore {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.restore-btn {
    padding: 0;
    display: flex;
    justify-content: flex-end;
    
    .v-icon {
        margin-bottom: 8px;
    }
}

legend {
    font-size: 1em;
}

.v-range-slider {
    margin-top: 25px;
}

.custom-chip {
    background-color: #3c4798 !important;
    color: white;
}

.date-range-inputs, .time-range-inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.buttons {
    padding-top: 20px !important;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

button[variant="elevated"] {
    border: none;
}

</style>