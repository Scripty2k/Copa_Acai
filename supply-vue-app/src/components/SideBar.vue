<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="sidebar-header">
        <h2>Copa Açai</h2>
        <div v-if="isLoggedIn" class="sidebar-user"><span>Hello,</span><span>{{ userEmail }}</span></div>
      </div>
      <div class="sidebar-nav">
        <nav>
          <router-link to="/" class="">Products</router-link>
          <router-link to="/profile" class="" v-if="isLoggedIn">Profile</router-link>
          <router-link to="/login" class="" v-if="!isLoggedIn">Login</router-link>
        </nav>
      </div>
    </div>
    <button @click="handleSignOut" v-if="isLoggedIn" class="logout-btn">Log out</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(false);
const userEmail = ref("");

let auth;

// code here runs once when component is added/mounted to the page 
onMounted(() => {
  auth = getAuth(); // get the autentication instance
  // code below runs every time the authentication state changes (login/logout)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true;
      userEmail.value = user.email; // Set email
    } else {
      isLoggedIn.value = false;
      userEmail.value = "";
    }
  });
});

// function that will logout the user and redirect to login page
const handleSignOut = () =>{
  signOut(auth).then(() => {
    router.push('/login');
  });
}
</script>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: flex-start;
  padding-bottom: 2rem;
  position: relative;
  width: 100%;
}
.sidebar-content {
  flex: 1 1 auto;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}
.sidebar-user {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #1c1c1c;
  font-weight: 500;
}
.sidebar-nav nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-top: 2rem;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.sidebar-nav .router-link-active,
.sidebar-nav .router-link-exact-active {
  color: var(--primary-color, #f5ead7);
  font-weight: 700;
  background: #fdf7f0;
  border-radius: 6px;
}
.sidebar-nav a {
  font-size: 1.1rem;
  color: #1c1c1c;
  text-decoration: none;
  padding: 0.5rem 1.2rem;
  border: none;
  background: none;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  outline: none;
  margin: 0;
  text-align: left;
  text-align: center;
  width: 100%;
  display: block;
}
.sidebar-nav a:hover {
  background: var(--primary-color, #f5ead7);
  color: #fff;
}
.logout-btn {
  font-size: 1.1rem;
  color: #1c1c1c;
  text-decoration: none;
  padding: 0.5rem 1.2rem;
  margin-bottom: 1rem;
  border: none;
  background: none;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.5px;
  width: 100%;
  margin-top: 0.5rem;
  text-align: center;
  position: sticky;
  bottom: 0;
  background: #fff;
}
.logout-btn:hover {
  background: var(--primary-color, #f5ead7);
  margin-bottom: 1rem;
  color: #fff;
}
</style>