<template>
	<div class="messages-page">
		<header class="header">
			<h1>Messagerie</h1>
		</header>
		<div v-if="conversations && conversations.length > 0" class="message-list-container">
			<div class="message-list">
				<div 
					v-for="conversation in conversations"
					:key="conversation.id"
					class="message-item"
					@click="$router.push(`/conversation/${conversation.conversationPartner._id}`)"
				>
					<img src="../assets/user.png" alt="Profil" class="profile-pic" />
					<div class="message-content">
						<h2>{{ conversation.conversationPartner.prenom + " " + conversation.conversationPartner.nom }}</h2>
						<p>{{ conversation.latestMessage.content }}</p>
					</div>
				</div>
			</div>
		</div>
		<p v-else>Ta messagerie est vide pour le moment.</p>
	</div>
</template>

<script>
import axios from 'axios';
import { useStore } from '../stores/store';
import { ref, onBeforeMount } from 'vue';

export default {
	name: "Conversations",
	setup() {
		const store = useStore();
		const conversations = ref([]);

		onBeforeMount(async () => {
			try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/message/${store.userId}`);
                if (response.status === 200) {
                    conversations.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération des conversations");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

			console.log(conversations.value);
		})

		return {
			store,
			conversations
		}
	}
};

</script>

<style scoped>

.messages-page {
	background: rgba(255, 255, 255, .5);
	padding: 20px;
	min-height: 92vh;
}

.header {
	margin-bottom: 20px;
}

.message-list-container {
	padding: 10px;
	border-radius: 10px;
	background-color: rgb(196, 218, 247);
}

.message-list {
  display: flex;
  flex-direction: column;
}
.message-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.profile-pic {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
}
.message-content h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.message-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

</style>
