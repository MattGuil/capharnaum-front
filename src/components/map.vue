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
    setup(props, { emit }) {
        const mapContainer = ref(null);
        const map = ref(null);
        const markers = ref([]);
        const isMarkerClicked = ref(false);

        const clickOnMarker = (coord, activity) => {
            map.value.flyTo({
                center: ([coord[0], coord[1] - .02]),
                zoom: 11,
                duration: 1000,
                essential: true
            });
            emit('marker-clicked', activity);
            isMarkerClicked.value = true;
        };

        const addMarker = (coord, activity) => {
            const marker = new Marker({ color: "#3c4798" })
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
                    clickOnMarker(coordArray, activity);
                }
            });

            markers.value.push(marker);
        };

        const updateMarkers = async () => {
            markers.value.forEach(marker => marker.remove());
            markers.value = [];

            if (props.activities && props.activities.length > 0) {
                props.activities.forEach((activity) => {
                    (async () => {
                        try {
                            const result = await geocoding.forward(activity.location);
                            // console.log(result);
                            const coord = result.features[0]?.center;
                            // console.log(coord);
                            if (coord && coord.length === 2) {
                                addMarker(coord, activity);
                            }
                        } catch (error) {
                            console.error('Erreur de géocodage :', error);
                        }
                    })();
                });
            }
        };

        const centerOnActivity = (activity) => {
            if (activity && activity.location) {
                geocoding.forward(activity.location).then((result) => {
                    const coord = result.features[0]?.center;
                    if (coord && coord.length === 2) {
                        map.value.flyTo({
                            center: ([coord[0], coord[1] - .02]),
                            zoom: 11,
                            duration: 1000,
                            essential: true
                        });
                    }
                }).catch((error) => {
                    console.error('Erreur de géocodage pour centrer la carte :', error);
                });
            }
        };

        watch(() => props.activities, () => {
            updateMarkers();
        });

        onMounted(async () => {
            config.apiKey = '3vtmF9l2ovq2muHn9ogR';

            map.value = new Map({
                container: mapContainer.value,
                style: MapStyle.STREETS,
                geolocate: true,
                navigationControl: false
            });

            map.value.on('click', (event) => {
                if (!isMarkerClicked.value) {
                    emit('map-clicked');
                } else {
                    isMarkerClicked.value = false;
                }
            });

            const centerOnUserLocation = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;
                        
                        map.value.flyTo({
                            center: [longitude, latitude],
                            zoom: 11,
                            duration: 1000,
                            essential: true
                        });
                    }, (error) => {
                        console.error("Erreur de géolocalisation :", error);
                    });
                } else {
                    console.error("La géolocalisation n'est pas supportée par ce navigateur.");
                }
            };

            centerOnUserLocation();

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