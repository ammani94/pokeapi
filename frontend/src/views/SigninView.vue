<template>
  <div class="authentification">
    <form @submit.prevent="submitForm">
      <input v-model="formData.email" placeholder="email" required />
      <input v-model="formData.password" type="password" placeholder="Mot de passe" required />
      <button @click="() => submitForm()">Se connecter</button>
    </form>
  </div>
  <div class="signup">
    <router-link to="/signup">Créer un compte</router-link>
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
        const response = await axios.post('http://localhost:3000/signin', formData.value, {
          withCredentials: true
        })
        if (response.data.success) {
          store.setUserSession({
            email: response.data.user.email,
            userId: response.data.user.userId,
          })
          router.push({name: 'home'})
        } else {
          alert(result.data.message)
        }
    }
</script>

