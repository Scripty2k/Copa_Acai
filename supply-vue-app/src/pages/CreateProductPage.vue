<script setup>
import { ref } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const title = ref('');
const error = ref('');
const router = useRouter();
const isLoggedIn = ref(false);

onAuthStateChanged(getAuth(), (user) => {
  isLoggedIn.value = !!user;
  if (!user) {
    router.push('/login');
  }
});

async function submitPost() {
  if (!title.value) {
    error.value = "All fields are required.";
    return;
  }
  try {
    await addDoc(collection(db, "products"), {
      title: title.value,
      createdAt: serverTimestamp()
    });
    router.push('/');
  } catch (e) {
    console.error("Error creating post:", e);
    error.value = "Failed to create post: " + e.message;
  }
}
</script>

<template>
  <div class="layout">
    <div class="main-content">
      <h1>Create Post</h1>
      <form @submit.prevent="submitPost" class="create-post-form">
        <div>
          <label>Title:</label>
          <input v-model="title" type="text" required />
        </div>
        <button type="submit" class="button">Submit</button>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
}
.main-content {
  flex: 1;
  padding: 2rem;
}
.create-post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}
.button {
  padding: 10px 20px;
  background: var(--primary-color, #1c1c1c);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>