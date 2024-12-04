<template>
	<div class="favorites-list">
		<h2>Mes favoris</h2>
		<div @click="$router.push(`/activity/${favorite._id}`);" class="favorite-card" v-for="favorite in favorites" :key="favorite._id">
			<i class="mdi mdi-heart"></i>
			<img :src="favorite.srcImage" alt="Activity Image" class="activity-image" />
			<div class="activity-details">
				<h3>{{ favorite.title }}</h3>
				<p><strong>Horaires :</strong> {{ favorite.startTime + " - " + favorite.endTime }}</p>
				<p><strong>Adresse :</strong> {{ favorite.location }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';

export default {
	setup() {
		const favorites = ref([]);
		
		const loadImage = (discipline) => {
            let imageSrc = '';
            try {
                imageSrc = new URL(`../assets/${discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`, import.meta.url).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return imageSrc;
        }

		onMounted(async () => {
			try {
				const response = await axios.get(`${import.meta.env.APP_API_URL}/favorite/user/${localStorage.getItem('userId')}`);

				if (response.status === 200) {
					response.data.forEach(elem => {
						const activity = elem.activity;
						activity.srcImage = loadImage(activity.discipline);
						favorites.value.push(activity);
					})
				} else {
					console.log("Erreur lors de la récupération des favoris")
				}
			} catch (error) {
				console.error("Erreur de connexion ou autre :", error);
			}
		})

		return { favorites }
	}
};
</script>

<style scoped>

.favorites-list {
	padding: 20px;
	padding-bottom: 10vh;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 20px;
}

.favorite-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 15px;
	border: 1px solid #ddd;
	border-radius: 10px;
	background: rgba(255, 255, 255, .8);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease-in-out;
	position: relative;
}

.favorite-card:hover {
	transform: scale(1.05);
}

.activity-image {
	width: 100%;
	height: 150px;
	border-radius: 10px;
	margin-bottom: 15px;
	object-fit: cover;
}

.activity-details {
	text-align: center;
}

.activity-details h3 {
	margin: 0 0 10px;
	font-size: 18px;
	color: #333;
}

.activity-details p {
	margin: 5px 0;
	font-size: 14px;
	color: #666;
}

.mdi {
	margin-bottom: 10px;
}

.mdi-heart-outline {
    color: black;
}

.mdi-heart {
    color: red;
}

</style>