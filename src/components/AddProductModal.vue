<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['save', 'cancel'])

const name = ref('')
const quantity = ref(1)
const imagePreview = ref('')
const imageData = ref('')

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            imagePreview.value = e.target.result
            imageData.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const save = () => {
    if (name.value.trim()) {
        emit('save', {
            name: name.value,
            quantity: quantity.value,
            image: imageData.value
        })
        name.value = ''
        quantity.value = 1
        imagePreview.value = ''
        imageData.value = ''
    }
}
</script>

<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>Add New Product</h3>
      
      <div class="form-group">
        <label>Product Name</label>
        <input v-model="name" type="text" placeholder="e.g. Acai Bowl" autofocus @keyup.enter="save" />
      </div>
      
      <div class="form-group">
        <label>Initial Quantity</label>
        <input v-model.number="quantity" type="number" min="0" @keyup.enter="save" />
      </div>

      <div class="form-group">
        <label>Product Image (Optional)</label>
        <input type="file" @change="handleFileChange" accept="image/*" class="file-input" />
        <div v-if="imagePreview" class="preview-container">
            <img :src="imagePreview" class="preview-image" alt="Preview" />
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" @click="$emit('cancel')">Cancel</button>
        <button class="btn-confirm" @click="save">Add Product</button>
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
  max-width: 400px;
  text-align: left;
}

h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-family: 'Cabinet Grotesk', sans-serif;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #666;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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
.file-input {
    border: none;
    padding: 0;
}

.preview-container {
    margin-top: 10px;
    width: 100%;
    height: 150px;
    border: 1px dashed #ccc;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f9f9f9;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
</style>
