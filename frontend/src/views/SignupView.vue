<template>
  <div class="authentification">
    <form @submit.prevent="submitForm">
    <input v-model="formData.email" placeholder="email" required />
    <input v-model="formData.password" type="password" placeholder="Mot de passe" required />
    <button @click="() => submitForm()">Créer un compte</button>
  </form>
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

