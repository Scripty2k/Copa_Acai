<script setup>
import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const title = ref('');
const error = ref('');
const isLoading = ref(false);
const router = useRouter();
const isLoggedIn = ref(false);

onAuthStateChanged(getAuth(), (user) => {
  isLoggedIn.value = !!user;
  if (!user) {
    router.push('/login');
  }
});

async function submitPost() {
  // Reset previous errors
  error.value = '';

  if (!title.value) {
    error.value = "Item name is required.";
    return;
  }

  isLoading.value = true;
  try {
    console.log('Starting item creation process...');
    
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      error.value = "You must be logged in to create items.";
      isLoading.value = false;
      return;
    }

    // Add item to Firestore
    console.log('Adding item to Firestore...');
    const docRef = await addDoc(collection(db, "products"), {
      name: title.value,
      ownerId: currentUser.uid,
      createdAt: serverTimestamp()
    });
    console.log('Item added successfully with ID:', docRef.id);
    
    // Reset form
    title.value = '';
    
    // Wait a moment before routing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Navigate back
    await router.push('/');
    console.log('Navigation complete');
  } catch (e) {
    console.error("Error creating item:", e);
    console.error("Error code:", e.code);
    console.error("Error message:", e.message);
    error.value = "Failed to create item: " + e.message;
    isLoading.value = false;
  }
}

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="layout">
    <div class="main-content">
      <div class="header">
        <button @click="goBack" class="back-btn">← Back</button>
        <h1>Add Storage Item</h1>
      </div>
      <form @submit.prevent="submitPost" class="create-post-form">
        <div>
          <label>Item Name:</label>
          <input v-model="title" type="text" placeholder="e.g., Açai Bowl" required />
        </div>

        <button type="submit" class="button" :disabled="isLoading">
          {{ isLoading ? 'Adding...' : 'Add Item' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

h1 {
  color: var(--text-color);
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: #f5ead7;
  color: #1c1c1c;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  white-space: nowrap;
}

.back-btn:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.back-btn:active {
  transform: translateY(0);
}

.create-post-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

input[type="text"],
input[type="number"],
input[type="file"] {
  padding: 10px;
  border: 1px solid #e5e0d8;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  transition: border 0.2s ease;
}

input[type="text"]:focus,
input[type="number"]:focus,
input[type="file"]:focus {
  outline: none;
  border-color: #f5ead7;
  box-shadow: 0 0 0 3px rgba(245, 234, 215, 0.1);
}

.button {
  padding: 12px 20px;
  background: #f5ead7;
  color: #1c1c1c;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.button:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #e53935;
  padding: 0.75rem;
  background: rgba(229, 57, 53, 0.1);
  border-radius: 4px;
  border-left: 3px solid #e53935;
}
</style>