<template>
    <div class="activities-list">
        <h1>Mes activités</h1>
        <p v-for="activity in activities">{{ activity.title }}</p>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    name: 'AccountActivities',
    setup() {
        const activities = ref([]);

        onMounted(() => {
            activities.value = JSON.parse(localStorage.getItem('activities'));
        })

        onUnmounted(() => {
            localStorage.removeItem('activities');
        })

        return { activities }
    }
};
</script>

<style scoped>

.activities-list {
    padding: 20px;
    padding-bottom: 10vh;
}

</style>