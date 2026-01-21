<script setup>
import FrameGallery from './components/FrameGallery.vue'
</script>

<template>
  <div class="app-container">
    <img src="/logo.png" alt="COPA AÇAÍ Logo" class="app-logo" />
    <FrameGallery />
  </div>
</template>

<style scoped>
.app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    font-family: 'Inter', sans-serif;
}
.app-logo {
    max-width: 300px;
    height: auto;
    margin-bottom: 2rem;
    transition: transform 0.3s ease;
}

.app-logo:hover {
    transform: scale(1.05);
}
</style>
