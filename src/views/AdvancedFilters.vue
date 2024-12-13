<template>
    <h1>{{ store.lastUserLocation }}</h1>
</template>

<script>
import { useStore } from '../stores/store';

export default {
    name: 'AdvancedFilters',

    setup() {

        const store = useStore();

        return {
            store
        }
    }

};

</script>

<style>

</style>