<script setup>
defineProps({
  visible: Boolean,
  message: String
})

defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-confirm" @click="$emit('confirm')">Delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #333;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 1rem;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.9;
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #333;
}

.btn-confirm {
  background-color: #ef4444;
  color: white;
}
</style>
