<script setup>
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const props = defineProps({
  id: String,
  name: String
});

const emit = defineEmits(['delete']);

const quantity = ref(0);
const isAdding = ref(false);

function incrementQuantity() {
  quantity.value++;
}

function decrementQuantity() {
  if (quantity.value > 0) {
    quantity.value--;
  }
}

function handleDelete() {
  if (confirm(`Are you sure you want to delete "${props.name}"?`)) {
    emit('delete', props.id);
  }
}

async function addToRestock() {
  if (quantity.value < 1) {
    alert('Please select a quantity greater than 0');
    return;
  }

  isAdding.value = true;
  try {
    await addDoc(collection(db, 'items'), {
      name: props.name,
      quantity: quantity.value,
      productId: props.id,
      createdAt: new Date()
    });
    
    // Reset quantity after successful add
    quantity.value = 0;
    
    // Optional: Show success message
    alert(`Added ${quantity.value > 1 ? quantity.value + ' units of ' : ''}${props.name} to restock list`);
  } catch (error) {
    console.error('Error adding to restock:', error);
    alert('Failed to add item to restock list: ' + error.message);
  } finally {
    isAdding.value = false;
  }
}
</script>

<template>
  <div class="item-card">
    <div class="item-info">
      <h3>{{ name }}</h3>
      
      <div class="quantity-section">
        <div class="quantity-label">Quantity:</div>
        <div class="quantity-controls">
          <button @click="decrementQuantity" class="qty-btn minus-btn" :disabled="quantity === 0">
            −
          </button>
          <span class="quantity-display">{{ quantity }}</span>
          <button @click="incrementQuantity" class="qty-btn plus-btn">
            +
          </button>
        </div>
      </div>

      <button 
        @click="addToRestock" 
        class="add-restock-btn" 
        :disabled="quantity < 1 || isAdding"
        title="Add to restock list"
      >
        {{ isAdding ? 'Adding...' : 'Add to Restock' }}
      </button>

      <button @click="handleDelete" class="delete-btn" title="Delete item">
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.item-card {
  background: url('@/assets/images/border.png') center/contain no-repeat;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  font-size: 0.85rem;
  margin: 0 0 0.75rem 0;
  text-align: center;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quantity-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  justify-content: center;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: 2px solid #f5ead7;
  border-radius: 6px;
  background-color: white;
  color: #1c1c1c;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover:not(:disabled) {
    background-color: #f5ead7;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.add-restock-btn {
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background-color: #28a745;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #218838;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
}

.delete-btn {
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background-color: #dc3545;
  color: white;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;

  &:hover {
    background-color: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>