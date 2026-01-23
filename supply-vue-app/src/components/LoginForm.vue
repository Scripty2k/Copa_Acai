<script setup>
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

// vue ref variables that to hold form data and error message 
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  error.value = ""; // clear all previous errors
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); // redirect to feed page on successful login
  } catch (e) {
    switch (e.code) {
      case "auth/user-not-found":
        error.value = "No account found with this email.";
        break;
      case "auth/invalid-password":
        error.value = "Incorrect password.";
        break;
      case "auth/invalid-email":
        error.value = "Invalid email format.";
        break;
      case "auth/invalid-credential":
        error.value = "Invalid login credentials.";
        break;
      default:
        error.value = "Login failed. Please try again.";
        break;
    }
  }
};

</script>

<template>
  <div class="login-form">
    <form @submit.prevent="login">
      <label>Email:</label>
      <input v-model="email" type="email" required />
      <label>Password:</label>
      <input v-model="password" type="password" required />
      <button type="submit">Login</button>
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
      background-color: #f5ead7;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #e8d9bf;
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
  color: #1c1c1c;
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
  border: 1.5px solid var(--primary-color, #f5ead7);
  outline: none;
}

button[type="submit"] {
  padding: 12px 0;
  background-color: #f5ead7;
  color: #000000;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(245,234,215,0.08);
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #e2bceb;
  box-shadow: 0 4px 16px rgba(245,234,215,0.12);
}

.error {
  color: #e53935;
  margin-top: 0.5rem;
  text-align: center;
  font-size: 1rem;
}
</style>