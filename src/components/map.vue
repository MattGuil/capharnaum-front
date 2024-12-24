<template>
    <div class="map-wrap">
        <div class="map" ref="mapContainer"></div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { config, Map, MapStyle, GeolocationType, Marker } from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default {
    name: 'map',
    props: {
        activities: {
            type: Array,
            required: true
        }
    },
    setup(props, { emit }) {
        const mapContainer = ref(null);
        const map = ref(null);
        const markers = ref([]);
        const isMarkerClicked = ref(false);

        const clickOnMarker = (activity) => {
            map.value.flyTo({
                center: activity.coordinates,
                zoom: 14,
                duration: 1000,
                essential: true
            });
            emit('marker-clicked', activity);
            isMarkerClicked.value = true;
        };

        const addMarker = (activity) => {
            const color = (activity.maxParticipants - activity.nbParticipants > 0) ? "#3c4798" : "#d04e4e";
            const marker = new Marker({ color })
                .setLngLat([activity.coordinates.lng, activity.coordinates.lat])
                .addTo(map.value);

            marker.activity = activity;

            marker.getElement().addEventListener('click', () => {
                if (marker.activity) {
                    clickOnMarker(activity);
                }
            });

            markers.value.push(marker);
        };

        const updateMarkers = () => {
            markers.value.forEach(marker => marker.remove());
            markers.value = [];

            if (props.activities && props.activities.length > 0) {
                props.activities.forEach((activity) => {
                    addMarker(activity);
                });
            }
        };

        const centerOnActivity = (activity) => {
            map.value.flyTo({
                center: activity.coordinates,
                zoom: 11,
                duration: 1000,
                essential: true
            });
        };

        watch(() => props.activities, () => {
            updateMarkers();
            console.log('MARKERS UPDATED.');
        });

        onMounted(async () => {
            config.apiKey = '3vtmF9l2ovq2muHn9ogR';

            map.value = new Map({
                container: mapContainer.value,
                style: MapStyle.STREETS,
                geolocate: GeolocationType.POINT,
                navigationControl: false
            });

            map.value.on('click', (event) => {
                if (!isMarkerClicked.value) {
                    emit('map-clicked');
                } else {
                    isMarkerClicked.value = false;
                }
            });

            updateMarkers();
        });

        onUnmounted(() => {
            map.value?.remove();
        });

        return {
            mapContainer,
            centerOnActivity
        };
    }
};
</script>

<style scoped>

.map-wrap {
  position: relative;
  width: 100%;
  height: 92vh;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}

</style>