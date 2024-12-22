<template>
	<div class="banner" :style="{ backgroundImage: `url(${srcImage})` }"></div>

	<v-card v-if="activity" class="elevation-0 w-100 pa-10">
		<h1>Modifier mon activité</h1>

		<v-form @submit.prevent="updateActivity">
			<fieldset>
				<legend>Intitulé</legend>
				<v-text-field class="custom-input" v-model="form.title" variant="solo"
					:rules="[rules.required]"></v-text-field>
			</fieldset>

			<fieldset>
				<legend>Discipline</legend>
				<v-select class="custom-input" v-model="form.discipline" :items="disciplines" variant="solo"
					:rules="[rules.required]"></v-select>
			</fieldset>

			<fieldset>
				<legend>Adresse</legend>
				<v-text-field class="custom-input" ref="addressInput" v-model="form.address" variant="solo"
					:rules="[rules.required]"></v-text-field>
			</fieldset>

			<fieldset>
				<legend>Type d'activité</legend>
				<v-radio-group v-model="form.type" inline :rules="[rules.required]">
					<v-radio v-for="type in types" :label="type" :value="type"></v-radio>
				</v-radio-group>
			</fieldset>

			<fieldset v-if="form.type === 'regulière'">
				<legend>Jour de la semaine</legend>
				<v-select class="custom-input" v-model="form.day" :items="days" variant="solo"
					:rules="form.type === 'regulière' ? [rules.required] : []"></v-select>
			</fieldset>

			<fieldset v-if="form.type === 'ponctuelle'">
				<legend>Date</legend>
				<v-date-input class="custom-input" v-model="form.date" variant="solo" prepend-icon="" placeholder=""
					color="black" :rules="form.type === 'ponctuelle' ? [rules.required] : []"></v-date-input>
			</fieldset>

			<fieldset>
				<legend>Horaires</legend>
				<div class="time-range-inputs">
					<v-text-field class="custom-input" v-model="form.startTime" label="Début" :active="startTimeMenu"
						@focus="startTimeMenu" readonly variant="solo" :rules="[rules.required]">
						<v-menu v-model="startTimeMenu" :close-on-content-click="true" activator="parent"
							transition="scale-transition">
							<v-time-picker v-if="startTimeMenu" v-model="form.startTime" format="24hr"
								color="#3c4798"></v-time-picker>
						</v-menu>
					</v-text-field>

					<v-text-field class="custom-input" v-model="form.endTime" label="Fin" :active="endTimeMenu"
						@focus="endTimeMenu" readonly variant="solo" :rules="[rules.required]">
						<v-menu v-model="endTimeMenu" :close-on-content-click="true" activator="parent"
							transition="scale-transition">
							<v-time-picker v-if="endTimeMenu" v-model="form.endTime" format="24hr"
								color="#3c4798"></v-time-picker>
						</v-menu>
					</v-text-field>
				</div>
			</fieldset>

			<fieldset>
				<legend>Description (optionnelle)</legend>
				<v-textarea class="custom-input" v-model="form.description" auto-grow variant="solo"></v-textarea>
			</fieldset>

			<fieldset>
				<legend>Prix (€)</legend>
				<v-number-input class="custom-input" v-model="form.price" min="0" variant="solo"></v-number-input>
			</fieldset>

			<fieldset>
				<legend>Capacité d'accueil (personnes)</legend>
				<v-number-input class="custom-input" v-model="form.maxParticipants" min="1"
					variant="solo"></v-number-input>
			</fieldset>

			<v-btn type="submit" color="#3c4798" class="mt-4" block>
				Modifier l'activité
			</v-btn>
		</v-form>

		<v-snackbar v-model="errorSnackbarVisible" :timeout="3000" location="bottom center" color="red">
			{{ errorMessage }}
		</v-snackbar>

		<v-snackbar v-model="successSnackbarVisible" :timeout="3000" location="bottom center" color="green">
			Activité mise à jour avec succès !
		</v-snackbar>
	</v-card>
</template>

<script>
import axios from 'axios';
import { useStore } from '../stores/store';
import { useRouter } from 'vue-router';
import { ref, onBeforeMount, onMounted } from 'vue';
import { VNumberInput } from 'vuetify/labs/VNumberInput';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { VTimePicker } from 'vuetify/labs/VTimePicker';

export default {
	name: 'ManageActivity',
	props: {
		id: {
			type: String,
			required: true
		}
	},
	components: {
		VNumberInput,
		VDateInput,
		VTimePicker
	},
	setup(props) {

		const store = useStore();
		const router = useRouter();

		const activity = ref(null);
        const srcImage = ref('');

		const isLoadingEnums = ref(true);
		const disciplines = ref([]);
		const types = ref([]);
		const days = ref([]);

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

		const startTimeMenu = ref(false);
		const endTimeMenu = ref(false);

		const loadImage = () => {
            let imageSrc = '';
            try {
                imageSrc = new URL(
                    `../assets/${activity.value.discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`,
                    import.meta.url
                ).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return imageSrc;
        };

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

		onBeforeMount(async () => {
			try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/${props.id}`);
                if (response.status === 200) {
                    activity.value = response.data;
					
					if (activity.value.owner !== store.userId) {
						router.push(`/profile/${store.userId}`);
					}

					form.value.title = activity.value.title;
					form.value.discipline = activity.value.discipline;
					form.value.type = activity.value.type;
					form.value.address = activity.value.address;
					form.value.placeName = activity.value.placeName;
					form.value.day = activity.value.day;
					form.value.date = activity.value.date;
					form.value.startTime = activity.value.startTime;
					form.value.endTime = activity.value.endTime;
					form.value.description = activity.value.description;
					form.value.price = activity.value.price;
					form.value.maxParticipants = activity.value.maxParticipants;
                } else {
                    console.error('Erreur lors de la récupération de l\'activité');
                }
            } catch (error) {
                console.error(error);
            }

			srcImage.value = loadImage();
		})

		onMounted(async () => {
			await fetchEnums();
			initializeAutocomplete();
		})

		return {
			store,
			router,
			activity,
			srcImage,
			disciplines,
			types,
			days,
			form,
			rules,
			errorMessage,
			errorSnackbarVisible,
			successSnackbarVisible,
			addressInput,
			initializeAutocomplete,
			startTimeMenu,
			endTimeMenu,
			isLoadingEnums
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
		async updateActivity() {

			const isValid = this.validateForm();

			if (!isValid) {
				this.errorMessage = "Veuillez remplir tous les champs requis.";
				this.errorSnackbarVisible = true;
				return;
			} else {
				let coordinates = this.activity.coordinates;

				if (this.activity.address != this.form.address) {
					try {					
						const response = await axios.get(`${import.meta.env.APP_BACK_URL}/geocode?address=${this.form.address}`);
						if (response.data.results[0].geometry.location) {
							coordinates = {
								lat: response.data.results[0].geometry.location.lat,
								lng: response.data.results[0].geometry.location.lng
							};
						} else {
							this.errorMessage = "L'adresse renseignée n'existe pas.";
							this.errorSnackbarVisible = true;
						}
					} catch (error) {
						this.errorMessage = `Erreur de géocodage : ${error}`;
						this.errorSnackbarVisible = true;
					}
				}

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
					owner: this.store.userId
				};

				try {
					const response = await axios.put(`${import.meta.env.APP_API_URL}/activity/${this.id}`, activityData);
					if (response.status === 200) {
						console.log(this.form);
						this.successSnackbarVisible = true;
						setTimeout(() => {
							this.$router.push(`/profile/${this.store.userId}`);
						}, 3000);
					} else {
						this.errorMessage = "Erreur lors de la modification de l'activité.";
						this.errorSnackbarVisible = true;
					}
				} catch (error) {
					this.errorMessage = "Erreur de connexion ou autre.";
					this.errorSnackbarVisible = true;
				}
			}
		}
	}
};
</script>

<style scoped>

.v-container {
	position: relative;
}

.banner {
    position: fixed;
    width: 100%;
    height: 30vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.v-card {
	z-index: 1;
	position: absolute;
	width: 100%;
	margin-top: 12vh;
	padding-bottom: 8vh;
	background: rgba(255, 255, 255, 1);
	border-radius: 20px 20px 0 0;
}

h1 {
	margin-bottom: 25px;
}

legend {
	font-size: 1em;
}

label {
	color: black !important;
	opacity: 1 !important;
}

.custom-input {
	box-shadow: none !important;
}

.time-range-inputs {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 10px;
}

.v-btn[type="submit"] {
	margin-bottom: 8vh;
}

</style>