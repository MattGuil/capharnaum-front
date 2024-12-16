import { defineStore } from 'pinia';
import axios from 'axios';

export const useStore = defineStore('store', {
    state: () => ({
        userId: null,
        lastUserLocation: null,
        advancedFilters: {
            sortMethod: 'price'
        },
        activities: [],
        activitiesByInterest: {},
        distanceCache: {},
    }),
    getters: {
        activityIds(state) {
            return state.activities.map(activity => activity._id);
        },
    },
    actions: {
        updateUserId(newUserId) {
            this.userId = newUserId;
        },
        resetUserId() {
            this.userId = null;
        },
        updateUserLocation(newLocation) {
            this.lastUserLocation = newLocation;
        },
        updateAdvancedFilters(advancedFilters) {
            this.advancedFilters = advancedFilters;
        },
        updateSortMethod(sortMethod) {
            this.advancedFilters.sortMethod = sortMethod;
        },
        async fetchActivitiesFromAPI(advancedFilters) {
            try {
                const response = await axios.post(`${import.meta.env.APP_API_URL}/activity/filter/${this.userId}`, advancedFilters);
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
            const apiActivities = await this.fetchActivitiesFromAPI(this.advancedFilters);

            // const newActivities = apiActivities.filter(activity => !this.activityIds.includes(activity._id));
            // this.activities.push(...apiActivities);

            this.activities = apiActivities;

            return apiActivities;
        },
        updateActivitiesByInterest(activitiesByInterest) {
            state.activitiesByInterest = activitiesByInterest;
        },
        getDistanceFor(activityId) {
            if (this.distanceCache[activityId])
                return this.distanceCache[activityId];
        },
        updateDistanceCache(activityId, distance, duration) {
            this.distanceCache[activityId] = { distance, duration };
        },
        resetDistanceCache() {
            this.distanceCache = {};
        },
        resetStore() {
            this.$reset();
            localStorage.removeItem('store');
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'store',
                storage: localStorage,
                paths: ['userId', 'lastUserLocation', 'activities', 'distanceCache'],
            },
        ],
    },
});
