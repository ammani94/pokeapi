<script setup>
import axios from 'axios'
import { ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
const emit = defineEmits(['team-created'])
const formData = ref({
  name: '',
  user_id:''
})
const router = useRouter()
import { useAppStore } from '../stores/user'
let store = useAppStore()
const submitCreateTeam = async () => {
  try {
        formData.value.user_id = store.userSession.email
        const response = await axios.post(
          'http://localhost:3000/create_team',
          formData.value,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
    formData.value.name = ''
    alert(response.data.message)
    emit('team-created')
  } catch (error) {
    console.error('Erreur :', error);
    alert('Une erreur est survenue.');
  }
}
</script>

<template>
  <div class="team">
    <h1>Créer une équipe</h1>
    <form @submit.prevent="submitCreateTeam">
    <input v-model="formData.name" placeholder="Nom de l'équipe" required />
    <button type="submit">Créer l'équipe</button>
  </form>
  </div>
</template>
