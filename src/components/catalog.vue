<template>
    <div>
        <div class="knob-container">
            <span class="knob" @click="$emit('toggle-catalog')">
                <p>_</p>
            </span>
        </div>
        <div class="activity-cards-container">
            <activityCard 
                v-for="activity in activities" 
                :key="activity.id" 
                :activity="activity"
                @fav-updated="updateFav"
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
    },
    methods: {
        updateFav() {
            this.$emit('fav-updated');
        }
    }
}
</script>

<style scoped>

.knob-container {
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0 20px 0;
    position: fixed;
    background-color: white;
    border-radius: 10px 10px 0 0;
}

.knob {
    z-index: 1000;
    width: 60px;
    height: 5px;
    background-color: gray;
    border-radius: 10px;
    cursor: pointer;
}

.knob p {
    color: transparent;
}

.activity-cards-container {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: .5em;
    padding: 10px;
}

</style>