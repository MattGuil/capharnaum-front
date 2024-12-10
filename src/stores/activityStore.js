import { defineStore } from 'pinia';
import axios from 'axios';

export const useActivityStore = defineStore('activityStore', {
    state: () => ({
        activities: [],
    }),
    getters: {
        activityIds(state) {
            return state.activities.map(activity => activity._id);
        },
    },
    actions: {
        async fetchActivitiesFromAPI() {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity`);
                if (response.status === 200) {
                    return response.data;
                } else {
                    console.error("Erreur lors de la récupération des activités");
                    return [];
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
                return [];
            }
        },
        async refreshActivities() {
            const apiActivities = await this.fetchActivitiesFromAPI();
            const apiIds = apiActivities.map(activity => activity._id);

            const newActivities = apiActivities.filter(activity => !this.activityIds.includes(activity._id));
            
            this.activities.push(...newActivities);

            return newActivities;
        },
    },
});
