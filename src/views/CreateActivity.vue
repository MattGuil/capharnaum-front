<template>
    <v-card class="elevation-0 w-100 pa-10">
        <h3>Créer une nouvelle activité</h3>

        <v-form @submit.prevent="createActivity">
            <v-text-field
                v-model="form.title"
                label="Intitulé"
                variant="solo"
                :rules="[rules.required]"
            ></v-text-field>

            <v-select
                v-model="form.discipline"
                label="Discipline"
                :items="disciplines"
                variant="solo"
                :rules="[rules.required]"
            ></v-select>

            <v-text-field
                ref="addressInput"
                v-model="form.address"
                label="Adresse"
                variant="solo"
                :rules="[rules.required]"
            ></v-text-field>

            <v-radio-group 
                v-model="form.type"
                label="Type"
                inline
                :rules="[rules.required]"
            >
                <v-radio v-for="type in types" :label="type" :value="type"></v-radio>
            </v-radio-group>

            <v-select
                v-if="form.type === 'regulière'"
                v-model="form.day"
                label="Jour de la semaine"
                :items="days"
                variant="solo"
                :rules="form.type === 'regulière' ? [rules.required] : []"
            ></v-select>

            <v-date-input
                v-if="form.type === 'ponctuelle'"
                v-model="form.date"
                label="Date"
                variant="solo"
                prepend-icon=""
                color="black"
                :rules="form.type === 'ponctuelle' ? [rules.required] : []"
            ></v-date-input>

            <v-text-field
                v-model="form.startTime"
                label="Heure de début"
                :active="startTimeMenu"
                @focus="startTimeMenu"
                readonly
                variant="solo"
                :rules="[rules.required]"
            >
                <v-menu
                    v-model="startTimeMenu"
                    :close-on-content-click="true"
                    activator="parent"
                    transition="scale-transition"
                >
                    <v-time-picker
                        v-if="startTimeMenu"
                        v-model="form.startTime"
                        format="24hr"
                        color="#3c4798"
                    ></v-time-picker>
                </v-menu>                   
            </v-text-field>

            <v-text-field
                v-model="form.endTime"
                label="Heure de fin"
                :active="endTimeMenu"
                @focus="endTimeMenu"
                readonly
                variant="solo"
                :rules="[rules.required]"
            >
                <v-menu
                    v-model="endTimeMenu"
                    :close-on-content-click="true"
                    activator="parent"
                    transition="scale-transition"
                >
                    <v-time-picker
                        v-if="endTimeMenu"
                        v-model="form.endTime"
                        format="24hr"
                        color="#3c4798"
                    ></v-time-picker>
                </v-menu>                   
            </v-text-field>

            <v-textarea
                v-model="form.description"
                label="Description (optionnelle)"
                auto-grow
                variant="solo"
            ></v-textarea>

            <v-number-input
                v-model="form.price"
                label="Prix (€)"
                min="0"
                variant="solo"
            ></v-number-input>

            <v-number-input
                v-model="form.maxParticipants"
                label="Capacité d'accueil (personnes)"
                min="1"
                variant="solo"
            ></v-number-input>

            <v-btn type="submit" color="#3c4798" class="mt-4" block>
                Créer l'activité
            </v-btn>
        </v-form>

        <v-snackbar v-model="errorSnackbarVisible" :timeout="3000" location="bottom center" color="red">
            {{ errorMessage }}
        </v-snackbar>

        <v-snackbar v-model="successSnackbarVisible" :timeout="3000" location="bottom center" color="green">
            "{{ this.form.title }}" créé(e) avec succès !
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default {
    name: 'CreateActivity',
    components: {
        VNumberInput, 
        VDateInput, 
        VTimePicker
    },
    setup() {
        const disciplines = ['danse', 'dessin', 'théâtre', 'musique', 'photographie'];
        const types = ['ponctuelle', 'regulière'];
        const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
        
        const startTimeMenu = ref(false);
        const endTimeMenu = ref(false);

        const form = ref({
            title: '',
            discipline: '',
            type: '',
            address: '',
            placeName: '',
            day: '',
            date: null,
            startTime: '',
            endTime: '',
            description: '',
            price: 0.0,
            maxParticipants: 5
        });

        const rules = {
            required: (value) => !!value
        };

        const errorMessage = ref('');
        const errorSnackbarVisible = ref(false);
        const successSnackbarVisible = ref(false);

        const addressInput = ref();
        let addressAutocompleteInit = false;
        let addressAutocomplete = null;

        const initializeAutocomplete = () => {
            if (!addressAutocompleteInit) {
                const inputElement = addressInput.value?.$el.querySelector('input');

                if (inputElement) {
                    addressAutocomplete = new google.maps.places.Autocomplete(inputElement, {
                        componentRestrictions: { country: 'fr' },
                        fields: ['formatted_address', 'name']
                    });

                    addressAutocomplete.addListener('place_changed', () => {
                        const place = addressAutocomplete.getPlace();
                        if (place) {
                            if (place.formatted_address) form.value.address = place.formatted_address;
                            if (place.name) form.value.placeName = place.name;
                        }
                    });

                    addressAutocompleteInit = true;
                }
            }
        };

        onMounted(() => {
            initializeAutocomplete();
        })

        return { 
            disciplines,
            types,
            days,
            startTimeMenu,
            endTimeMenu,
            form,
            rules,
            errorMessage,
            errorSnackbarVisible,
            successSnackbarVisible,
            addressInput, 
            initializeAutocomplete
        };
    },
    methods: {
        validateForm() {
            if (!this.form.title || 
                !this.form.discipline || 
                !this.form.type ||
                !this.form.address) {
                return false;
            }

            if (this.form.type === 'regulière' && 
                (!this.form.day || !this.form.startTime || !this.form.endTime)) {
                return false;
            }

            if (this.form.type === 'ponctuelle' && 
                (!this.form.date || !this.form.startTime || !this.form.endTime)) {
                return false;
            }

            return true;
        },
        async createActivity() {

            const isValid = this.validateForm();

            if (!isValid) {
                this.errorMessage = "Veuillez remplir tous les champs requis.";
                this.errorSnackbarVisible = true;
                return;
            } else {

                try {
                    const response = await axios.get(`https://maps.google.com/maps/api/geocode/json?address=${encodeURIComponent(this.form.address)}&key=${import.meta.env.APP_GOOGLE_MAPS_API_KEY}`);
                    
                    if (response.data.results[0].geometry.location) {
                        
                        const coordinates = { 
                            lat: response.data.results[0].geometry.location.lat, 
                            lng: response.data.results[0].geometry.location.lng 
                        };
                        
                        const activityData = {
                            title: this.form.title,
                            discipline: this.form.discipline,
                            type: this.form.type,
                            address: this.form.address,
                            placeName: this.form.placeName,
                            coordinates: coordinates,
                            day: this.form.day,
                            date: this.form.date ? new Date(this.form.date) : null,
                            startTime: this.form.startTime,
                            endTime: this.form.endTime,
                            description: this.form.description,
                            price: parseFloat(this.form.price),
                            maxParticipants: this.form.maxParticipants,
                            owner: localStorage.getItem('userId'),
                        };

                        try {
                            const response = await axios.post(`${import.meta.env.APP_API_URL}/activity`, activityData);
                            if (response.status === 201) {
                                console.log(this.form);
                                this.successSnackbarVisible = true;
                            } else {
                                this.errorMessage = "Erreur lors de la création de l'activité.";
                                this.errorSnackbarVisible = true;
                            }
                        } catch (error) {
                            this.errorMessage = "Erreur de connexion ou autre.";
                            this.errorSnackbarVisible = true;
                        }
                    } else {
                        this.errorMessage = "L'adresse renseignée n'existe pas.";
                        this.errorSnackbarVisible = true;
                    }
                } catch (error) {
                    this.errorMessage = `Erreur de géocodage : ${error}`;
                    this.errorSnackbarVisible = true;
                }
            }
        }
    }
};
</script>

<style scoped>
.v-card {
    width: 100%;
    margin-top: 12vh;
    padding-bottom: 8vh;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px 20px 0 0;
}

form {
    margin-top: 50px;
}

</style>  