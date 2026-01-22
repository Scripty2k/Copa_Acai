<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

const items = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Fetch items from Firebase in real-time
onMounted(() => {
  try {
    const q = query(collection(db, 'items'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      items.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      isLoading.value = false;
    }, (err) => {
      console.error('Error fetching items:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      error.value = `Failed to load items: ${err.message}`;
      isLoading.value = false;
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  } catch (err) {
    console.error('Error setting up listener:', err);
    error.value = 'Failed to set up database listener';
    isLoading.value = false;
  }
});

// Delete a single item
const deleteItem = async (itemId) => {
  try {
    await deleteDoc(doc(db, 'items', itemId));
    console.log('Item deleted successfully');
  } catch (err) {
    console.error('Error deleting item:', err);
    error.value = 'Failed to delete item';
  }
};

// Clear entire list
const clearList = async () => {
  if (items.value.length === 0) {
    alert('List is already empty');
    return;
  }

  const confirmClear = confirm(`Are you sure you want to delete all ${items.value.length} items? This cannot be undone.`);
  if (!confirmClear) return;

  try {
    const batch = writeBatch(db);
    
    items.value.forEach((item) => {
      batch.delete(doc(db, 'items', item.id));
    });
    
    await batch.commit();
    console.log('All items cleared successfully');
    error.value = null;
  } catch (err) {
    console.error('Error clearing list:', err);
    error.value = 'Failed to clear list';
  }
};
</script>

<template>
  <div class="restock-list-container">
    <div class="restock-header">
      <h2>Restock Items</h2>
      <button 
        v-if="items.length > 0"
        @click="clearList" 
        class="clear-btn"
      >
        Clear All
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      Loading items...
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && items.length === 0 && !error" class="empty-state">
      <p>No items in the restock list</p>
    </div>

    <!-- Items List -->
    <ul v-if="!isLoading && items.length > 0" class="items-list">
      <li v-for="item in items" :key="item.id" class="item">
        <div class="item-content">
          <span class="item-title">{{ item.title || item.name }}</span>
          <span class="item-amount">{{ item.amount || item.quantity }}</span>
        </div>
        <button 
          @click="deleteItem(item.id)"
          class="delete-btn"
          title="Delete this item"
        >
          ✕
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.restock-list-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.restock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.restock-header h2 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.clear-btn:hover {
  background-color: #c82333;
}

.clear-btn:active {
  transform: scale(0.98);
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 16px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px 16px;
  border-radius: 5px;
  margin-bottom: 20px;
  border-left: 4px solid #f5c6cb;
}

.items-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  transition: box-shadow 0.2s ease;
}

.item:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.item-content {
  display: flex;
  gap: 15px;
  flex: 1;
  align-items: center;
}

.item-title {
  font-weight: 600;
  color: #333;
  flex: 1;
}

.item-amount {
  background-color: #e9ecef;
  padding: 5px 12px;
  border-radius: 4px;
  color: #555;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.delete-btn {
  background-color: #f8f9fa;
  color: #dc3545;
  border: 1px solid #dee2e6;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.delete-btn:active {
  transform: scale(0.95);
}
</style>
