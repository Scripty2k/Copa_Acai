<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import SideBar from '../components/SideBar.vue';

const isLoggedIn = ref(false);
const router = useRouter();
const posts = ref([]);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

onMounted(async () => {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  posts.value = querySnapshot.docs.map(doc => doc.data());
});

// function goToCreatePost() {
//   router.push('/create-post');
// }
</script>

<template>
  <div class="layout">
    <SideBar />
    <div class="main-content">
      <div class="create-post-button">
        <button v-if="isLoggedIn" @click="goToCreatePost" class="button"><img src="../assets/images/more.png" width="30px" height="30px"></button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 2rem 1rem;
}
.main-content {
  flex: 1;
  padding: 2rem;
}

.button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: auto;
  margin-bottom: 1rem;
}

.create-post-button {
  display: flex;
  justify-content: flex-end;
}
</style>