<!-- filepath: c:\Users\timva\Documents\Sintlucas\Leerjaar 4\sd4-p13-startproject-2526-Tim-V-G\startproject\src\components\RegisterForm.vue -->
<script setup>
import { ref } from "vue";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const error = ref("");

const register = async () => {
  error.value = "";
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
     console.log("account created successfully");
  } catch (e) {
    error.value = e.message;
  }
};
</script>

<template>
  <div class="register-form">
    <form @submit.prevent="register">
      <label>Email:</label>
      <input v-model="email" type="email" required />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <button type="submit">Register</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<style scoped lang="scss">

.form {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  form {
    display: flex;
    flex-direction: column;
    width: 300px;

    label {
      margin-bottom: 5px;
      font-weight: bold;
    }

    input {
      margin-bottom: 15px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 10px;
      background-color: #42b983;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #369870;
      }
    }
  }
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

form {
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 1.2rem;
  border-radius: 10px;
  padding: 2rem 2rem 1.5rem 2rem;
}

label {
  font-weight: 600;
  margin-bottom: 0.2rem;
  color: #333;
}

input[type="email"],
input[type="password"] {
  padding: 10px;
  border: 1px solid #cfd8dc;
  border-radius: 5px;
  font-size: 1rem;
  transition: border 0.2s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border: 1.5px solid var(--primary-color, #4392F1);
  outline: none;
}

button[type="submit"] {
  padding: 12px 0;
  background-color: #4392F1;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(67,146,241,0.08);
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #4346f1;
  box-shadow: 0 4px 16px rgba(67,146,241,0.12);
}

.error {
  color: #e53935;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
}
</style>