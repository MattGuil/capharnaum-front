<template>
  <div class="message-detail">
    <button class="back-button" @click="$emit('close')">Retour</button>
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
  </div>
</template>

<script>
export default {
  props: ["message"],
  methods: {
    isSentByUser(msg) {
      return msg.sender === "Moi";
    },
  },
};
</script>

<style scoped>
.message-detail {
  display: flex;
  flex-direction: column;
}
.back-button {
  margin-bottom: 10px;
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.back-button:hover {
  background-color: #0056b3;
}
.messages {
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
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
</style>
