<template>
	<div class="message-detail">
		<div class="message-detail-header">
			<v-icon @click="navigateToConversations()" icon="mdi-arrow-left"></v-icon>
			<div @click="navigateToCorrespondentProfile()">
				<img src="../assets/user.png" alt="Photo de profil">
				<h2 class="person-name">{{ correspondent ? correspondent.prenom + ' ' + correspondent.nom : '...' }}</h2>
			</div>
		</div>

		<div class="messages">
			<v-card
				v-for="message in conversation" 
				:key="message.id" 
				class="elevation-5 chat-message" 
				:class="{ sent: isSentByUser(message) }"
			>
				<div class="message-content">{{ message.content }}</div>
				<div class="message-time">{{ new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }}</div>
			</v-card>
		</div>

		<div class="message-input-bar">
			<v-text-field 
				v-model="newMessage"
				placeholder="Votre message..." 
				@keyup.enter="sendMessage"
				class="new-message-field pa-0"
				density="compact"
				variant="solo-filled"
				hide-details
				append-icon="mdi-send"
				append-icon-class="send-icon"
				@click:append="sendMessage"
			/>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import { useStore } from '../stores/store';
import { ref, onBeforeMount } from 'vue';

export default {
	name: "Conversation",
    props: {
        correspondentId: {
            required: true
        }
    },
	setup(props) {
		const store = useStore();
		const conversation = ref([]);
		const correspondent = ref(null);

		onBeforeMount(async () => {
			try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/message/${store.userId}/${props.correspondentId}`);
                if (response.status === 200) {
                    conversation.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération des conversations");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

			try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/user/${props.correspondentId}`);
                if (response.status === 200) {
                    correspondent.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération de l'identité du correspondant");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }

			console.log(conversation.value);
			console.log(correspondent.value);
		})

		return {
			store,
			conversation,
			correspondent
		}
	},
	methods: {
		navigateToConversations() {
			this.$router.push('/conversations');
		},
		navigateToCorrespondentProfile() {
			this.$router.push(`/profile/${this.correspondentId}`);
		},
		isSentByUser(message) {
			return message.from === this.store.userId;
		},
		async sendMessage() {
			if (this.newMessage.trim() !== "") {
				
				await axios.post(`${import.meta.env.APP_API_URL}/message/send`, {
					from: this.store.userId,
					to: this.correspondentId,
					content: this.newMessage
				});
				this.newMessage = "";
			}
		},
	},
};

</script>

<style scoped>

.message-detail {
	display: flex;
	flex-direction: column;
	position: relative;
	background: rgba(255, 255, 255, .5);
}

.message-detail-header {
	height: 10vh;
	padding: 15px;
	background-color: white;
	display: flex;
	align-items: center;
}

.message-detail-header > .v-icon {
	margin-right: 10px;
}

.message-detail-header div {
	display: flex;
	align-items: center;
	cursor: pointer;
}

.message-detail-header div img {
	height: 35px;
	margin-right: 10px;
}

.person-name {
	margin: 0;
	font-size: 18px;
	font-weight: bold;
}

.messages {
	overflow-y: auto;
	padding: 0 15px;
	padding-bottom: 10px;
	height: 72vh;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
}

.chat-message {
	max-width: 70%;
	min-width: 50%;
	margin-bottom: 10px;
	padding: 10px;
	border-radius: 10px;
	background-color: #f1f1f1;
	align-self: flex-start;
}

.chat-message.sent {
	background-color: rgba(60, 71, 152, .75);
	align-self: flex-end;
	color: white;
	box-shadow: 1px solid black;
}

.message-content {
	font-size: 14px;
	margin-bottom: 5px;
}

.message-time {
	font-size: 12px;
	text-align: right;
}

.chat-message .message-time {
	color: gray;
}

.chat-message.sent .message-time {
	color: lightcyan;
}

.message-input-bar {
	position: fixed;
	bottom: 8vh;
	left: 0;
	width: 100%;
	background-color: white;
	padding: 15px;
}

.mdi-send {
	color: #3c4798;
	opacity: 1;
}

</style>
