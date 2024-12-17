<template>
    <v-bottom-navigation class="elevation-0">
        <v-btn value="home" @click="navigateToHome">
            <v-icon size="30" color="#3c4798">mdi-home-variant</v-icon>
        </v-btn>
        <v-btn value="explore" @click="navigateToExplore">
            <v-icon size="30" color="#3c4798">mdi-magnify</v-icon>
        </v-btn>
        <v-btn value="create" @click="navigateToCreate">
            <v-icon size="30" color="#3c4798">mdi-plus-box-outline</v-icon>
        </v-btn>
        <v-btn value="messages" @click="navigateToMessages">
            <v-icon size="30" color="#3c4798">mdi-email</v-icon>
        </v-btn>
        <v-btn value="account" @click="navigateToProfile">
            <v-icon size="30" color="#3c4798">mdi-account</v-icon>
        </v-btn>
    </v-bottom-navigation>
</template>

<script>
import { useStore } from '../stores/store';

export default {
    name: 'navbar',
    setup() {
        const store = useStore();

        return { store };
    },
    methods: {
        navigateToHome() {
            this.$router.push('/home');
        },
        navigateToExplore() {
            this.$router.push('/explore');
        },
        navigateToCreate() {
            this.$router.push('/create/activity');
        },
        navigateToMessages() {
            this.$router.push('/conversations');
        },
        navigateToProfile() {
            this.$router.push(`/profile/${this.store.userId}`);
        },
    },
}
</script>

<style scoped>

</style>