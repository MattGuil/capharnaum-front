<template>
    <v-card @click="clickCard">
        <img :src="srcImage" alt="">
        <h1>{{ activity.title }}</h1>
        <h2>{{ activity.place }}</h2>
    </v-card>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'activityCard',
    props: {
        activity: {
            required: true
        }
    },
    setup(props) {
        let srcImage = ref('');
        
        const loadImage = () => {
            let srcImage;
            try {
                srcImage = new URL(`../assets/${props.activity.discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`, import.meta.url).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return srcImage;
        }

        srcImage = loadImage();
        return { activity: props.activity, srcImage };
    },
    methods: {
        clickCard() {
            this.$router.push(`/activity/${this.activity._id.toString()}`);
        }
    }
};
</script>

<style scoped>

.v-card {
    margin: 0;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 5px 5px lightgray;
    cursor: pointer;
}

img {
    width: 100%;
    height: 100px;
    object-fit: cover;
    border-radius: 5px;
    margin-bottom: 10px;
}

h1 {
    font-weight: bold;
    font-size: 1rem;
}

h2 {
    font-size: .75rem;
}

</style>