<template>
    <div>
        <SearchInput v-model="searchVal" />
        <div class="activity-cards-container">
            <activityCard v-for="activity in activities" :key="activity.id" :activity="activity" />
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import SearchInput from 'vue-search-input';
import 'vue-search-input/dist/styles.css';
import activityCard from './activityCard.vue';

export default {
    name: 'catalog',
    components: {
        SearchInput,
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
        let searchVal = ref('');
        return { searchVal };
    }
};
</script>

<style scoped>

.search-input-wrapper {
    width: 90%;
    margin: auto;
    margin-top: 20px;
}

.activity-cards-container {
    padding: 10px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1em;
}

</style>