<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { collection, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase';
import SideBar from '../components/SideBar.vue';
import ProductCard from '../components/ProductCard.vue';

const isLoggedIn = ref(false);
const router = useRouter();
const items = ref([]);
const sidebarRef = ref(null);
const isLoading = ref(true);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

onMounted(async () => {
  try {
    console.log('Fetching items from Firestore...');
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    items.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log('Items loaded:', items.value.length);
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    isLoading.value = false;
  }
});

function goToCreateProduct() {
  // Close sidebar on mobile when create post is clicked
  if (sidebarRef.value) {
    sidebarRef.value.closeSidebar();
  }
  router.push('/create-product');
}

async function deleteItem(itemId) {
  console.log('Delete function called with itemId:', itemId);
  try {
    console.log('Attempting to delete document from Firestore...');
    await deleteDoc(doc(db, "items", itemId));
    console.log('Document deleted from Firestore');
    // Remove the item from the local array
    items.value = items.value.filter(item => item.id !== itemId);
    console.log('Item deleted successfully, remaining items:', items.value.length);
  } catch (error) {
    console.error("Error deleting item:", error);
    console.error("Error details:", error.message);
    alert('Failed to delete item: ' + error.message);
  }
}
</script>

<template>
  <div class="layout">
    <SideBar ref="sidebarRef" />
    <div class="main-content">
      <div class="header">
        <h1>Storage Management</h1>
        <button v-if="isLoggedIn" @click="goToCreateProduct" class="button add-btn">
          Add Item
        </button>
      </div>

      <div v-if="isLoading" class="loading">Loading items...</div>
      
      <div v-else-if="items.length === 0" class="empty-state">
        <p>No items yet. Start by adding your first storage item!</p>
      </div>

      <div v-else class="items-grid">
        <ProductCard
          v-for="item in items"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          @delete="deleteItem"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.main-content {
  flex: 1;
  padding: 2rem 3rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 5rem 1rem 1rem 1rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 5rem 0.75rem 1rem 0.75rem;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  h1 {
    color: var(--text-color);
    margin: 0;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;

    h1 {
      font-size: 1.75rem;
    }
  }
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-color);
}

.loading {
  font-size: 1.1rem;
  opacity: 0.7;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  p {
    font-size: 1.1rem;
    opacity: 0.8;
    max-width: 400px;
  }
}

.button {
  background-color: #f5ead7;
  color: #1c1c1c;
  border: none;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  font-weight: 600;

  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>