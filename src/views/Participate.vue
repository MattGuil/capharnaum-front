<template>
    <div>
        <button @click="showPopup = true">Afficher le Popup</button>

        <div v-if="showPopup" class="popup-overlay">
        <div class="popup">
            <img src="../assets/dessin.jpg" alt="Illustration" class="popup-image" />
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
        alert("Merci pour votre participation !");
        this.showPopup = false;
        },
        handleCancel() {
        alert("Vous avez changé d’avis.");
        this.showPopup = false;
        },
    },
};
</script>

<style scoped>
/* Style de l'arrière-plan du popup */

.popup-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 1000;
}

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