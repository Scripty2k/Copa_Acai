<script setup>
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import SideBar from '../components/SideBar.vue';

const showRegister = ref(false);  // false means show login form, true means show register form
</script>

<template>
  <div class="layout">
    <SideBar />
    <div class="main-content">
      <div class="auth-container">
        <div class="auth-card">
          <h1>{{ showRegister ? 'Register' : 'Login' }}</h1>
          <LoginForm v-if="!showRegister" />
          <RegisterForm v-else />
          <div class="switch-link">
            <span v-if="!showRegister">
              Don't have an account?
              <a href="#" @click.prevent="showRegister = true">Register</a>
            </span>
            <span v-else>
              Already have an account?
              <a href="#" @click.prevent="showRegister = false">Login</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// sidebar/layout styles
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
  display: flex;
  align-items: center;
  justify-content: center;
}
// auth card styles
.auth-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.auth-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(67,146,241,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
  padding: 2.5rem 2rem 2rem 2rem;
  min-width: 340px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.auth-card h1 {
  margin-bottom: 1.5rem;
  color: var(--primary-color, #4392F1);
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}
.switch-link {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1rem;
}
.switch-link a {
  color: var(--primary-color, #4392F1);
  text-decoration: underline;
  cursor: pointer;
  margin-left: 0.25rem;
}
</style>