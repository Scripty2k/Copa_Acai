<script setup>
import { ref } from 'vue'
import ImageFrame from './ImageFrame.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import AddProductModal from './AddProductModal.vue'
import StockAdjustmentModal from './StockAdjustmentModal.vue'

const frames = ref([
  { id: 1, label: 'Product 1', quantity: 10 },
  { id: 2, label: 'Product 2', quantity: 8 },
  { id: 3, label: 'Product 3', quantity: 15 },
  { id: 4, label: 'Product 4', quantity: 5 },
  { id: 5, label: 'Product 5', quantity: 1 },
])

const showDeleteModal = ref(false)
const showAddModal = ref(false)
const showStockModal = ref(false)
const frameToDelete = ref(null)

// Stock Adjustment State
const stockMode = ref('add') // 'add' or 'remove'
const selectedFrameId = ref(null)
const selectedProductName = ref('')
const selectedCurrentStock = ref(0)

const openAddModal = () => {
    showAddModal.value = true
}

const handleAddProduct = ({ name, quantity, image }) => {
    const newId = frames.value.length ? Math.max(...frames.value.map(f => f.id)) + 1 : 1
    frames.value.push({
        id: newId,
        label: name,
        quantity: quantity,
        src: image || ''
    })
    showAddModal.value = false
}

const cancelAddProduct = () => {
    showAddModal.value = false
}

const requestRemoveFrame = (id) => {
    frameToDelete.value = id
    showDeleteModal.value = true
}

const confirmRemoveFrame = () => {
    if (frameToDelete.value) {
        frames.value = frames.value.filter(f => f.id !== frameToDelete.value)
        frameToDelete.value = null
    }
    showDeleteModal.value = false
}

const cancelRemoveFrame = () => {
    frameToDelete.value = null
    showDeleteModal.value = false
}

// Stock Adjustment Handlers
const handleAdjustStock = (id, mode) => {
    const frame = frames.value.find(f => f.id === id)
    if (frame) {
        selectedFrameId.value = id
        selectedProductName.value = frame.label
        selectedCurrentStock.value = frame.quantity
        stockMode.value = mode
        showStockModal.value = true
    }
}

const confirmStockAdjustment = (quantity) => {
    const frame = frames.value.find(f => f.id === selectedFrameId.value)
    if (frame) {
        if (stockMode.value === 'add') {
            frame.quantity += quantity
        } else {
            // Validation is now handled in the modal, so we just subtract
            // But keeping Math.max for double safety logic
            frame.quantity = Math.max(0, frame.quantity - quantity)
        }
    }
    showStockModal.value = false
    selectedFrameId.value = null
}

const cancelStockAdjustment = () => {
    showStockModal.value = false
    selectedFrameId.value = null
}
const updateImage = (id, newSrc) => {
    const frame = frames.value.find(f => f.id === id)
    if (frame) {
        frame.src = newSrc
    }
}

const updateLabel = (id, newLabel) => {
    const frame = frames.value.find(f => f.id === id)
    if (frame) {
        frame.label = newLabel
    }
}
</script>

<template>
  <div class="gallery-container">
    <div class="gallery">
        <ImageFrame
        v-for="frame in frames"
        :key="frame.id"
        :label="frame.label"
        :quantity="frame.quantity"
        :src="frame.src"
        @delete="requestRemoveFrame(frame.id)"
        @adjust-stock="(mode) => handleAdjustStock(frame.id, mode)"
        @update:src="(newSrc) => updateImage(frame.id, newSrc)"
        @update:label="(newLabel) => updateLabel(frame.id, newLabel)"
        />
    </div>
    <button @click="openAddModal" class="add-button">Add Product</button>
    
    <ConfirmationModal 
        :visible="showDeleteModal" 
        message="Are you sure you want to delete this product?" 
        @confirm="confirmRemoveFrame" 
        @cancel="cancelRemoveFrame" 
    />

    <AddProductModal
        :visible="showAddModal"
        @save="handleAddProduct"
        @cancel="cancelAddProduct"
    />

    <StockAdjustmentModal
        :visible="showStockModal"
        :mode="stockMode"
        :product-name="selectedProductName"
        :current-stock="selectedCurrentStock"
        @confirm="confirmStockAdjustment"
        @cancel="cancelStockAdjustment"
    />
  </div>
</template>

<style scoped>
.gallery-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
}

.add-button {
    background-color: #000000;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    font-family: 'Cabinet Grotesk', sans-serif;
    transition: transform 0.2s, opacity 0.2s;
}

.add-button:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}

.add-button:active {
    transform: translateY(0);
}
</style>
