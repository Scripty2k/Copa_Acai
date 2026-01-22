<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebase';
import SideBar from '../components/SideBar.vue';
import ProductCard from '../components/ProductCard.vue';

const isLoggedIn = ref(false);
const router = useRouter();
const products = ref([]);
const sidebarRef = ref(null);

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

onMounted(async () => {
  const q = query(collection(db, "products"), orderBy("createdAt"));
  const querySnapshot = await getDocs(q);
  products.value = querySnapshot.docs.map(doc => doc.data());
});

function goToCreateProduct() {
  // Close sidebar on mobile when create post is clicked
  if (sidebarRef.value) {
    sidebarRef.value.closeSidebar();
  }
  router.push('/create-product');
}
</script>

<template>
  <div class="layout">
    <SideBar ref="sidebarRef" />
    <div class="main-content">
      <div class="create-post-button">
        <button v-if="isLoggedIn" @click="goToCreateProduct" class="button"><img src="../assets/images/more.png" width="30px" height="30px"></button>
      </div>
      <ProductCard
        v-for="(product, idx) in products"
        :key="idx"
        :title="product.title"
      />
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

.sidebar {
  width: 250px;
  border-right: 1px solid #ccc;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
  }
}

.main-content {
  flex: 1;
  padding: 2rem 3rem;
  max-width: 1200px;
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

.button {
  background-color: #f5ead7;
  border: none;
  cursor: pointer;
  padding: 10px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.button:hover {
  box-shadow: var(--shadow-md);
  transform: scale(1.05);
}

.button:active {
  transform: scale(0.98);
}

.create-post-button {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
}
</style>