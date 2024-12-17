<template>
  <div class="message-detail">
    <!-- En-tête avec nom et bouton Croix -->
    <div class="header">
      <h2 class="person-name">{{ message.name }}</h2>
      <button class="close-button" @click="$emit('close')">✕</button>
    </div>

    <!-- Zone des Messages -->
    <div class="messages">
      <div
        class="chat-message"
        v-for="msg in message.conversation"
        :key="msg.id"
        :class="{ sent: isSentByUser(msg) }"
      >
        <div class="message-content">{{ msg.text }}</div>
        <div class="message-time">{{ msg.time }}</div>
      </div>
    </div>

    <!-- Barre d'Écriture -->
    <div class="message-input-bar">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Écrire un message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" class="send-button">Envoyer</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["message"], // La prop contient l'objet message avec la propriété "name" et "conversation"
  data() {
    return {
      newMessage: "", // Message en cours d'écriture
    };
  },
  methods: {
    isSentByUser(msg) {
      return msg.sender === "Moi";
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        // Ajouter le nouveau message
        this.message.conversation.push({
          id: Date.now(),
          sender: "Moi",
          text: this.newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        this.newMessage = ""; // Réinitialiser la zone d'écriture
      }
    },
  },
};
</script>

<style scoped>
.message-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: rgb(196, 218, 247);
  position: relative;
}

/* En-tête avec nom et bouton croix */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(196, 218, 247);
  color: rgb(0, 0, 0);
  padding: 10px;
}
.close-button {
  background: none;
  border: none;
  color: rgb(0, 0, 0);
  font-size: 20px;
  cursor: pointer;
}
.person-name {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}
.chat-message {
  max-width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  align-self: flex-start;
}
.chat-message.sent {
  background-color: #dcf8c6;
  align-self: flex-end;
}
.message-content {
  font-size: 14px;
  margin-bottom: 5px;
}
.message-time {
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* Barre d'écriture */
.message-input-bar {
  position: fixed;
  bottom: 55px; /* Hauteur de la barre de navigation */
  left: 0;
  width: 100%;
  display: flex;
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
}
.message-input-bar input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  margin-right: 10px;
}
.send-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
}
.send-button:hover {
  background-color: #0056b3;
}
</style>
