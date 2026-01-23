<template>
  <div class="sidebar-wrapper">
    <button class="sidebar-toggle" @click="toggleSidebar" aria-label="Toggle sidebar">
      <span class="hamburger" :class="{ active: isOpen }"></span>
    </button>
    <div class="sidebar" :class="{ open: isOpen }">
      <button class="close-btn" @click="closeSidebar" aria-label="Close sidebar">✕</button>
      <div class="sidebar-content">
        <div class="sidebar-header">
          <img src="../assets/images/logo.png" alt="Copa Açai Logo" class="logo" />
          <div v-if="isLoggedIn" class="sidebar-user"><span>Hello,</span><span>{{ userEmail }}</span></div>
        </div>
        <div class="sidebar-nav">
          <nav>
            <router-link to="/" class="" @click="closeSidebar">Products</router-link>
            <router-link to="/restock" class="" v-if="isLoggedIn" @click="closeSidebar">Restock</router-link>
            <router-link to="/login" class="" v-if="!isLoggedIn" @click="closeSidebar">Login</router-link>
          </nav>
        </div>
      </div>
      <button @click="handleSignOut" v-if="isLoggedIn" class="logout-btn">Log out</button>
    </div>
    <div class="sidebar-overlay" :class="{ active: isOpen }" @click="closeSidebar"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(false);
const userEmail = ref("");
const isOpen = ref(false);

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

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

const closeSidebar = () => {
  isOpen.value = false;
};

// Expose closeSidebar so parent components can access it
defineExpose({
  closeSidebar
});
</script>

<style scoped lang="scss">
.sidebar-wrapper {
  position: relative;
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 999;
  background: #f5ead7;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.hamburger {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: #1c1c1c;
    transition: all 0.3s ease;
    left: 0;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  &::backdrop {
    position: absolute;
    width: 24px;
    height: 2px;
    background: #1c1c1c;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease;
  }

  &.active {
    &::before {
      transform: rotate(45deg);
      top: 50%;
      margin-top: -1px;
    }

    &::after {
      transform: rotate(-45deg);
      bottom: 50%;
      margin-bottom: -1px;
    }
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: flex-start;
  padding-bottom: 2rem;
  position: relative;
  width: 250px;
  background: white;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    width: 280px;
    z-index: 998;
    transform: translateX(-100%);

    &.open {
      transform: translateX(0);
    }
  }
}

.close-btn {
  display: none;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1c1c1c;
  z-index: 10;

  @media (max-width: 768px) {
    display: block;
  }
}

.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 997;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  @media (max-width: 768px) {
    display: block;

    &.active {
      opacity: 1;
      pointer-events: all;
    }
  }
}

.sidebar-content {
  flex: 1 1 auto;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;

  @media (max-width: 768px) {
    padding-top: 4rem;
  }
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

.logo {
  max-width: 100px;
  height: auto;
  margin-bottom: 0.5rem;
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
  text-align: center;
  width: 100%;
  display: block;
}

.sidebar-nav a:hover {
  background: #e2bceb;
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
  width: 90%;
  margin-top: 0.5rem;
  text-align: center;
  position: sticky;
  bottom: 0;
  background: #fff;
}

.logout-btn:hover {
  background: #e2bceb;
  color: #fff;
}
</style>