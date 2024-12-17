<template>
  <div class="message-list">
    <div
      class="message-item"
      v-for="message in messages"
      :key="message.id"
      @click="$emit('select-message', message)"
    >
      <img src="../assets/user.png" alt="Profil" class="profile-pic" />
      <div class="message-content">
        <h2>{{ message.name }}</h2>
        <p>{{ message.snippet }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["messages"],
};
</script>

<style scoped>
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
