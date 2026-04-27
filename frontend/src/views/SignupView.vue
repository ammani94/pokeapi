<template>
  <div class="authentification">
    <div class="auth-container">
      <h1 class="auth-title">Créer un compte</h1>
      
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

        <button type="submit" @click="() => submitForm()" class="auth-button">
          Créer un compte
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const formData = ref({
        email: '',
        password: ''
    })

    const submitForm = async () => {
        const response = await axios.post('http://localhost:3000/register', formData.value)
        console.log(response.data.message)
    }

    return {
      formData,
      submitForm
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/styles';
</style>
