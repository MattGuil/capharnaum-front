<template>
    <v-card class="elevation-0 w-100 pa-10">
        <h3>Créer une nouvelle activité</h3>

        <v-form @submit.prevent="createActivity">
            <!-- Titre de l'activité -->
            <v-text-field
                v-model="form.title"
                label="Titre de l'activité"
                variant="solo"
                :rules="[rules.required]"
            ></v-text-field>

            <!-- Discipline -->
            <v-select
                v-model="form.discipline"
                label="Discipline"
                :items="disciplines"
                variant="solo"
                :rules="[rules.required]"
            ></v-select>

            <!-- Type d'activité -->
            <v-select
                v-model="form.type"
                label="Type"
                :items="types"
                variant="solo"
                :rules="[rules.required]"
            ></v-select>

            <!-- Lieu de l'activité -->
            <v-text-field
                v-model="form.place"
                label="Lieu"
                variant="solo"
                :rules="[rules.required]"
            ></v-text-field>

            <!-- Localisation de l'activité -->
            <v-text-field
                v-model="form.location"
                label="Adresse"
                variant="solo"
                :rules="[rules.required]"
            ></v-text-field>

            <!-- Jour de la semaine -->
            <v-select
                v-if="form.type === 'cours' || form.type === 'pratique'"
                v-model="form.day"
                label="Jour de la semaine"
                :items="days"
                variant="solo"
                :rules="form.type === 'cours' || form.type === 'pratique' ? [rules.required] : []"
            ></v-select>

            <!-- Date de l'activité -->
            <v-date-input
                v-if="form.type !== '' && form.type !== 'cours' && form.type !== 'pratique'"
                v-model="form.date"
                label="Date"
                variant="solo"
                prepend-icon=""
                color="black"
                :rules="form.type != '' && form.type !== 'cours' || form.type !== 'pratique' ? [rules.required] : []"
            ></v-date-input>

            <div class="time-pickers">
                <!-- Horaire de début -->
                <v-text-field
                    v-model="form.startTime"
                    label="Heure de début"
                    :active="startTimeMenu"
                    :focus="startTimeMenu"
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
                            color="green-lighten-1"
                        ></v-time-picker>
                    </v-menu>                   
                </v-text-field>

                <!-- Horaire de fin -->
                <v-text-field
                    v-model="form.endTime"
                    label="Heure de fin"
                    :active="endTimeMenu"
                    :focus="endTimeMenu"
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
                            color="pink"
                            header-color="primary"
                        ></v-time-picker>
                    </v-menu>                   
                </v-text-field>
            </div>

            <!-- Description de l'activité -->
            <v-textarea
                v-model="form.description"
                label="Description (optionnel)"
                auto-grow
                variant="solo"
            ></v-textarea>

            <!-- Prix de l'activité -->
            <v-number-input
                v-model="form.price"
                label="Prix"
                min="0"
                variant="solo"
            ></v-number-input>

            <!-- Nombre maximal de participants -->
            <v-number-input
                v-model="form.maxParticipants"
                label="Capacité d'accueil"
                min="1"
                variant="solo"
            ></v-number-input>

            <v-btn type="submit" color="#3c4798" class="mt-4" block>
                Créer l'activité
            </v-btn>
        </v-form>

        <p v-if="errorMessage" class="text-danger" style="margin-top: 10px; text-align: center;">
            {{ errorMessage }}
        </p>

        <div class="margin"></div>

        <v-snackbar v-model="snackbarVisible" :timeout="3000" location="bottom center" color="green">
            "{{ this.form.title }}" créé(e) avec succès !
        </v-snackbar>
    </v-card>
</template>

<script>
import axios from 'axios';
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
    data() {
        return {
            disciplines: ['danse', 'dessin', 'théâtre', 'musique', 'photographie'],
            types: ['cours', 'pratique', 'rencontre', 'spectacle', 'expo'],
            statuses: ['fermée', 'complète', 'liste d\'attente', 'sans réservation', 'ouverte'],
            days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
            startTimeMenu: false,
            endTimeMenu: false,
            
            form: {
                title: 'Cours de danse',
                discipline: 'danse',
                type: 'cours',
                place: 'Maison de la Danse',
                location: '8 Av. Jean Mermoz, 69008 Lyon',
                day: 'mercredi',
                date: null,
                startTime: '18:00',
                endTime: '20:00',
                description: 'Cours de danse pour débutant.',
                price: '0',
                maxParticipants: '5'
            },

            rules: {
                required: (value) => !!value
            },

            errorMessage: '',
            snackbarVisible: false,
        };
    },
    methods: {
        validateForm() {
            if (!this.form.title || 
                !this.form.discipline || 
                !this.form.type || 
                !this.form.place || 
                !this.form.location) {
                return false;
            }

            if ((this.form.type === 'cours' || this.form.type === 'pratique') && 
                (!this.form.day || !this.form.startTime || !this.form.endTime)) {
                return false;
            }

            if (this.form.type !== 'cours' && 
                this.form.type !== 'pratique' && 
                (!this.form.date || !this.form.startTime || !this.form.endTime)) {
                return false;
            }

            return true;
        },
        async createActivity() {

            console.log(this.form);

            const isValid = this.validateForm();

            if (!isValid) {
                this.errorMessage = "Veuillez remplir tous les champs requis.";
                return;
            } else {
                const activityData = {
                    title: this.form.title,
                    discipline: this.form.discipline,
                    type: this.form.type,
                    place: this.form.place,
                    location: this.form.location,
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
                        this.snackbarVisible = true;
                    } else {
                        this.errorMessage = "Erreur lors de la création de l'activité.";
                    }
                } catch (error) {
                    this.errorMessage = "Erreur de connexion ou autre.";
                    console.error("Erreur lors de la création de l'activité", error);
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

.margin {
    height: 4vh;
}

</style>  