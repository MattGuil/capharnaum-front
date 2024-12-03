<template>
<div>
    <button @click="showPopup = true">Afficher le Popup</button>

    <div v-if="showPopup" class="popup-overlay">
    <div class="popup">
        <img src="" alt="Illustration" class="popup-image" />
        <h2>Souhaitez-vous participer à Peinture ?</h2>
        <div class="popup-buttons">
        <button class="participate" @click="handleParticipate">Je participe</button>
        <button class="cancel" @click="handleCancel">J’ai changé d’avis</button>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            showPopup: false,
        };
    },
    methods: {
        handleParticipate() {
            this.showPopup = false;
        },
        handleCancel() {
            this.showPopup = false;
        },
    },
};
</script>

<style scoped>

/* Style du popup */
.popup {
background: white;
padding: 20px;
border-radius: 10px;
text-align: center;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
width: 300px;
}

/* Style de l'image */
.popup-image {
width: 100%;
height: auto;
margin-bottom: 20px;
border-radius: 5px;
}

/* Style des boutons */
.popup-buttons button {
padding: 10px 20px;
margin: 5px;
border: none;
border-radius: 5px;
cursor: pointer;
}

.participate {
background-color: #a8df65;
color: white;
}

.cancel {
background-color: #e57373;
color: white;
}
</style>
