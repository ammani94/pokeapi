<template>
  <div class="authentification">
    <div class="auth-container">

      <form @submit.prevent="submitForm" class="auth-form">
        <div class="form-group">
          <label for="email" class="form-label">Adresse email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="ton@email.com"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Mot de passe</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            required
            class="form-input"
          />
        </div>

        <button id="submit" type="submit" @click="() => submitForm()" class="auth-button">
          Se connecter
        </button>
      </form>

      <div class="auth-links">
        <p class="auth-text">
          Pas de compte ?
          <router-link to="/signup" class="auth-link">En créer un</router-link>
        </p>
        <p class="auth-text mt-2">
          <router-link to="/forgot-password" class="auth-link">
            Mot de passe oublié ?
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/user'
import axios from 'axios'
const router = useRouter()
const store = useAppStore()
const formData = ref({
        email: '',
        password: ''
    })
    const submitForm = async () => {
  try {
    const response = await axios.post(
      'http://localhost:3000/signin',
      formData.value,
      { withCredentials: true }
    );

    if (response.data.success) {
      store.setUserSession({
        email: response.data.user.email,
        userId: response.data.user.userId,
      });
      router.push({ name: 'home' });
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message)
    } else if (error.request) {
      console.error("Aucune réponse du serveur (problème réseau)");
    } else {
      console.error("Erreur inconnue:", error.message);
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/styles';
</style>

