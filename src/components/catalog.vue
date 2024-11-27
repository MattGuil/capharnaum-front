<template>
    <div>
        <span class="knob" @click="$emit('toggle-catalog')">
            <p>_</p>
        </span>
        <div class="activity-cards-container">
            <activityCard 
                v-for="activity in activities" 
                :key="activity.id" 
                :activity="activity" 
            />
        </div>
    </div>
</template>

<script>
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
    }
}
</script>

<style scoped>

.knob {
    position: relative;
    z-index: 10;
    width: 60px;
    height: 5px;
    background-color: lightgray;
    margin: 10px 0 20px 0;
    border-radius: 10px;
}

.knob p {
    color: transparent;
}

.activity-cards-container {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
}

</style>