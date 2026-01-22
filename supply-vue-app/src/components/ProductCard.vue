<script setup>
import { ref } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const props = defineProps({
  id: String,
  name: String,
  quantity: Number,
  imageUrl: String
});

const localQuantity = ref(props.quantity);
const isUpdating = ref(false);

const updateQuantity = async (delta) => {
  const newQuantity = Math.max(0, localQuantity.value + delta);
  const previousQuantity = localQuantity.value;
  localQuantity.value = newQuantity;
  
  try {
    isUpdating.value = true;
    console.log(`Updating quantity from ${previousQuantity} to ${newQuantity} for item ${props.id}`);
    
    const itemRef = doc(db, 'items', props.id);
    await updateDoc(itemRef, {
      quantity: newQuantity
    });
    console.log('Quantity updated successfully');
  } catch (error) {
    console.error('Error updating quantity:', error);
    // Revert on error
    localQuantity.value = previousQuantity;
  } finally {
    isUpdating.value = false;
  }
};

const decreaseQuantity = () => updateQuantity(-1);
const increaseQuantity = () => updateQuantity(1);
</script>

<template>
  <div class="item-card">
    <div class="image-container">
      <img :src="imageUrl" :alt="name" />
    </div>
    <div class="item-info">
      <h3>{{ name }}</h3>
      <div class="quantity-display">Qty: {{ localQuantity }}</div>
      <div class="quantity-controls">
        <button 
          @click="decreaseQuantity" 
          class="btn decrease-btn"
          :disabled="isUpdating"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <button 
          @click="increaseQuantity" 
          class="btn increase-btn"
          :disabled="isUpdating"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  border: 1px solid #e5e0d8;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: #f5ead7;
  }
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f9f9f9;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .image-container img {
  transform: scale(1.05);
}

.item-info {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.1rem;
  word-break: break-word;
}

.quantity-display {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.decrease-btn {
  background: #e53935;
  color: white;

  &:hover:not(:disabled) {
    background: #d32f2f;
    box-shadow: var(--shadow-md);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
}

.increase-btn {
  background: #4caf50;
  color: white;

  &:hover:not(:disabled) {
    background: #45a049;
    box-shadow: var(--shadow-md);
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }
}
</style>