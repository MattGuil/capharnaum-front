<template>
    <div class="map-wrap">
        <div class="map" ref="mapContainer"></div>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { config, Map, MapStyle, Marker } from '@maptiler/sdk';
import { geocoding } from '@maptiler/client';
import '@maptiler/sdk/dist/maptiler-sdk.css';

export default {
    name: 'map',
    props: {
        activities: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const mapContainer = ref(null);
        const map = ref(null);

        const clickOnMarkerWithCoord = (coord) => {
            map.value.setCenter([coord[0], coord[1]]);
            map.value.setZoom(map.value.getZoom());
        };

        const addMarker = (coord) => {
            const marker = new Marker({ color: "#FF0000" })
                .setLngLat([coord[0], coord[1]])
                .addTo(map.value);

            marker.addClassName("[" + coord.toString() + "]");

            marker.getElement().addEventListener('click', () => {
                const classList = marker.getElement().classList;
                let coordString = '';
                
                for (let className of classList) {
                    if (className.startsWith('[') && className.endsWith(']')) {
                        coordString = className.slice(1, -1);
                        break;
                    }
                }

                if (coordString) {
                    const coordArray = coordString.split(',').map(Number);
                    clickOnMarkerWithCoord(coordArray);
                }
            });
        };

        watch(() => props.activities, (activities) => {
            if (activities && activities.length > 0) {
                activities.forEach((activity) => {
                    (async () => {
                        try {
                            const result = await geocoding.forward(activity.location);
                            console.log(result);
                            const coord = result.features[0]?.center;
                            console.log(coord);
                            if (coord && coord.length === 2) {
                                addMarker(coord);
                            }
                        } catch (error) {
                            console.error('Erreur de géocodage :', error);
                        }
                    })();
                });
            }
        });

        onMounted(async () => {
            config.apiKey = '3vtmF9l2ovq2muHn9ogR';

            map.value = new Map({
                container: mapContainer.value,
                style: MapStyle.STREETS,
                geolocate: true,
                navigationControl: false
            });
        });

        onUnmounted(() => {
            map.value?.remove();
        });

        return {
            mapContainer
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