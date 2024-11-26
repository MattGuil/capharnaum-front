<template>
    <div>
        <span class="knob" @click="$emit('toggle-catalog')"></span>
        <div class="activity-cards-container">
            <activityCard v-for="activity in activities" :key="activity.id" :activity="activity" />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import activityCard from './activityCard.vue';

export default {
    name: 'catalog',
    components: {
        activityCard
    },
    props: {
        activities: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        console.log(props.activities);
    }
}
</script>

<style scoped>

.knob {
    position: relative;
    z-index: 10;
    margin: 10px 0 20px 0;
    border: 3px solid gray;
    border-radius: 10px;
    width: 60px;
}

.activity-cards-container {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
}

</style>