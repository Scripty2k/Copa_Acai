<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  mode: String, // 'add' or 'remove'
  productName: String,
  currentStock: Number
})

const emit = defineEmits(['confirm', 'cancel'])

const quantity = ref(1)
const error = ref('')

const title = computed(() => props.mode === 'add' ? 'Add Stock' : 'Remove Stock')
const label = computed(() => props.mode === 'add' ? 'Quantity to add:' : 'Quantity to remove:')
const buttonText = computed(() => props.mode === 'add' ? 'Add Quantity' : 'Remove Quantity')

watch(() => props.visible, (newVal) => {
    if (newVal) {
        quantity.value = 1
        error.value = ''
    }
})

watch(quantity, () => {
    error.value = ''
})

const confirm = () => {
    if (quantity.value <= 0) return

    if (props.mode === 'remove' && quantity.value > props.currentStock) {
        error.value = `Cannot remove more than current stock (${props.currentStock})`
        return
    }
    
    emit('confirm', quantity.value)
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <p class="product-name">Product: <strong>{{ productName }}</strong></p>
      
      <div class="form-group">
        <label>{{ label }}</label>
        <input 
            v-model.number="quantity" 
            type="number" 
            min="1" 
            autofocus 
            @keyup.enter="confirm" 
            :class="{ 'input-error': error }"
        />
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-confirm" @click="confirm" :class="mode">{{ buttonText }}</button>
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
  width: 90%;
  max-width: 350px;
  text-align: left;
}

h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 1.5rem;
}

.product-name {
    margin-bottom: 1.5rem;
    color: #666;
    font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #000;
}

.input-error {
    border-color: #ef4444;
}

.input-error:focus {
    border-color: #ef4444;
}

.error-message {
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    margin-bottom: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
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
  background-color: #000;
  color: white;
}

.btn-confirm.remove {
    background-color: #ef4444;
}
</style>
