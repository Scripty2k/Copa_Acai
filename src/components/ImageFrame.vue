<script setup>
import { ref } from 'vue'
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Product'
  },
  quantity: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['delete', 'adjust-stock', 'update:src', 'update:label'])

const fileInput = ref(null)
const isEditingName = ref(false)
const editedName = ref('')
const nameInput = ref(null)

const requestDelete = () => {
    emit('delete')
}

const requestAdd = () => {
    emit('adjust-stock', 'add')
}

const requestRemove = () => {
    emit('adjust-stock', 'remove')
}

const triggerFileInput = () => {
    fileInput.value.click()
}

const removeImage = () => {
    emit('update:src', '')
}

const startEditingName = () => {
    editedName.value = props.label
    isEditingName.value = true
    // Wait for DOM update to focus input
    setTimeout(() => {
        nameInput.value?.focus()
    }, 0)
}

const saveName = () => {
    if (editedName.value.trim()) {
        emit('update:label', editedName.value.trim())
    }
    isEditingName.value = false
}

const cancelEditName = () => {
    isEditingName.value = false
}

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
            emit('update:src', e.target.result)
        }
        reader.readAsDataURL(file)
    }
    // Reset input value to allow selecting the same file again
    event.target.value = ''
}
</script>

<template>
  <div class="frame" :class="{ 'out-of-stock': quantity === 0 }">
    <button class="delete-btn" @click.stop="requestDelete">×</button>
    <div class="image-container">
      <img v-if="src" :src="src" :alt="label" class="frame-image" />
      <div v-else class="placeholder">
        <span>{{ label }}</span>
      </div>
      <div v-if="quantity === 0" class="stock-overlay">
        <span>OUT OF STOCK</span>
      </div>
      
      <!-- Hidden file input -->
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden-input" 
        accept="image/*"
        @change="handleFileChange"
      />
      
      <button v-if="src" class="delete-img-btn" @click.stop="removeImage" title="Remove Image">
        🗑️
      </button>

      <button class="add-img-btn" @click.stop="triggerFileInput" title="Change Image">
        📷
      </button>
    </div>
    
    <div class="info-section">
        <div v-if="isEditingName" class="name-edit-container">
            <input 
                ref="nameInput"
                v-model="editedName" 
                class="name-input" 
                @keyup.enter="saveName"
                @keyup.esc="cancelEditName"
                @blur="saveName"
            />
        </div>
        <div v-else class="name-display-container">
            <h3 class="product-title">{{ label }}</h3>
            <button class="edit-name-btn" @click.stop="startEditingName" title="Edit Name">✎</button>
        </div>
        
        <span class="stock-label">Stock: {{ quantity }}</span>
    </div>

    <div class="controls" @click.stop>
        <button class="action-btn remove" @click="requestRemove" :disabled="quantity === 0">Remove</button>
        <button class="action-btn add" @click="requestAdd">Add</button>
    </div>
  </div>
</template>

<style scoped>
.frame {
  background: white;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  width: 220px;
  height: 340px; /* Increased height for controls */
  display: flex;
  flex-direction: column;
  cursor: pointer;
  position: relative;
}

.delete-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  z-index: 10;
}

.frame:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  transform: scale(1.1);
  background-color: #dc2626;
}

.frame:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.image-container {
  flex: 1;
  background-color: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 200px;
}

.frame-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #9ca3af;
  font-weight: 600;
  font-size: 1.1rem;
}

.stock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #cc0000;
    font-weight: 800;
    font-size: 1.2rem;
    letter-spacing: 1px;
}

.info-section {
    padding: 10px 0 5px 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.name-display-container {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
    width: 100%;
}

.product-title {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
}

.edit-name-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    opacity: 0.3;
    padding: 2px;
    transition: opacity 0.2s;
}

.frame:hover .edit-name-btn {
    opacity: 0.6;
}

.edit-name-btn:hover {
    opacity: 1;
}

.name-edit-container {
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}

.name-input {
    width: 100%;
    font-family: inherit;
    font-size: 1.1rem;
    font-weight: 700;
    text-align: center;
    padding: 2px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.name-input:focus {
    outline: none;
    border-color: #000;
}

.stock-label {
    font-weight: 500;
    font-size: 1rem;
    color: #555;
    background: #f3f4f6;
    padding: 4px 12px;
    border-radius: 20px;
}

.hidden-input {
    display: none;
}

.add-img-btn, .delete-img-btn {
    position: absolute;
    bottom: 10px;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
}

.add-img-btn {
    right: 10px;
}

.delete-img-btn {
    right: 50px; /* Positioned left of camera */
    font-size: 1rem;
    color: #ef4444;
}

.image-container:hover .add-img-btn,
.image-container:hover .delete-img-btn {
    opacity: 1;
}

.add-img-btn:hover, .delete-img-btn:hover {
    transform: scale(1.1);
    background: white;
}

.controls {
    display: flex;
    gap: 10px;
    padding: 0 10px;
    margin-top: auto;
}

.action-btn {
    flex: 1;
    padding: 8px 0;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.2s;
    font-family: 'Cabinet Grotesk', sans-serif;
    color: white;
}

.action-btn:hover:not(:disabled) {
    opacity: 0.9;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.action-btn.add {
    background-color: #000;
}

.action-btn.remove {
    background-color: #ef4444;
}
</style>


