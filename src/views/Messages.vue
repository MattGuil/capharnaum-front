<template>
  <div class="messages-page">
    <header class="header">
      <h1>Messages</h1>
    </header>

    <div v-if="!selectedMessage" class="message-list-container">
      <MessageList
        :messages="messages"
        @select-message="selectMessage"
      />
    </div>

    <div v-else class="message-detail-container">
      <MessageDetail
        :message="selectedMessage"
        @close="closeMessage"
      />
    </div>
  </div>
</template>

<script>
import MessageList from "../components/MessageList.vue";
import MessageDetail from "../components/MessageDetail.vue";

export default {
  data() {
    return {
      messages: [
        {
          id: 1,
          name: "Personne1",
          snippet: "Message court...",
          conversation: [
            { id: 1, sender: "Moi", text: "Salut !", time: "10:00" },
            { id: 2, sender: "Personne1", text: "Bonjour !", time: "10:05" },
          ],
        },
        {
          id: 2,
          name: "Personne2",
          snippet: "Un autre message...",
          conversation: [
            { id: 1, sender: "Moi", text: "Comment ça va ?", time: "11:00" },
            { id: 2, sender: "Personne2", text: "Bien, merci !", time: "11:10" },
          ],
        },
      ],
      selectedMessage: null,
    };
  },
  methods: {
    selectMessage(message) {
      this.selectedMessage = message;
    },
    closeMessage() {
      this.selectedMessage = null;
    },
  },
  components: {
    MessageList,
    MessageDetail,
  },
};
</script>

<style scoped>
.messages-page {
  padding: 20px;
  background: linear-gradient(to bottom, #d6e8f9, #e8eff5);
}
.header {
  margin-bottom: 20px;
}
.message-list-container,
.message-detail-container {
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(196, 218, 247);
}
</style>
