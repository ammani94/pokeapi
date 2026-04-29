<template>
  <h1>Bienvenue sur mon app avec Mistral AI</h1>
  <form @submit.prevent="submitForm">
    <input v-model="formIa.query" placeholder="Instructions ..." required />
    <button @click="() => submitForm()">Valider</button>
  </form>
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue'
import {callMistralAPI} from '../api/mistral'
const message = ref('')
let formIa = ref({
    query: ''
})

const submitForm = async () => {
    message.value = ''
    console.log(formIa.value.query)
    try {
    message.value = await callMistralAPI(
      formIa.value.query
    );
  } catch (error) {
    message.value = "Erreur de chargement.";
  }
  formIa.value.query = ''
}
</script>

<style scoped>

.container {
  display: flex;
  flex-wrap: wrap;
}

.element {
  width: calc(70% - 10px);
  margin: 5px;
}


.pokemon-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  max-width: 300px;
  text-align: center;
}
.error {
  color: red;
}
</style>