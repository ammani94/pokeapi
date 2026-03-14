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

    const router = useRouter()

    const submitForm = async () => {
        const response = await axios.post('http://localhost:3000/signin', formData.value)
        if (response.data.success) {
          router.push({name: 'home'})
        } else {
          alert(result.data.message)
        }
    }

    return {
      formData,
      submitForm
    }
  }
}
</script>

