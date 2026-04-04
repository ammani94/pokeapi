<template>
  <div>
    <div v-if="loading">Chargement en cours...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="listPokemon" class="container element" >
      <div class="pokemon-card" v-for="listPokemons in pokemons" :key="listPokemons.name">
        <h2>{{ listPokemons.name }} (ID: {{ listPokemons.id }})</h2>
        <img :src="listPokemons.sprites.front_default" :alt="listPokemons.name" />
        <p>Types: {{ listPokemons.types.map(t => t.type.name).join(', ') }}</p>
        <p>Poids: {{ listPokemons.weight / 10 }} kg</p>
        <p>Taille: {{ listPokemons.height / 10 }} m</p>
        <button @click="() => freePokemons(listPokemons.id_pokemon)"> Capturer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/user'
let store = useAppStore()
let pokemons = ref(null)
let listPokemon = ref(null)
let loading = ref(null)
let error = ref(null)
let formData = ref({
        id_pokemon: ''
      })

const fetchPokemons = async() => {
      loading = true
      error = null
      try {
        const response = await axios.post('http://localhost:3000/fetch', {
          user_id:store.userSession.email
        }, {
          withCredentials: true
        })
        listPokemon.value = response.data.results
        const pokemonDetails = await Promise.all(
          listPokemon.value.map(async (pokemon) => {
            const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemon.api_id)
            return {
                ...pokemonResponse.data,
                id_pokemon: pokemon._id
            }
          })
        )
        pokemons.value = pokemonDetails
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        error = "Impossible de charger les données."
      } finally {
        loading = false
      }
    }
    const freePokemons = async(id) => {
      loading = true
      error = null
      try {
        const response = await axios.post('http://localhost:3000/free/'+id, {
          user_id:store.userSession.email
        }, {
          withCredentials: true
        })
        listPokemon.value = response.data.results
        const pokemonDetails = await Promise.all(
          listPokemon.value.map(async (pokemon) => {
            const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemon.api_id)
            return {
                ...pokemonResponse.data,
                id_pokemon: pokemon._id
            }
          })
        )
        pokemons.value = pokemonDetails
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        error = "Impossible de charger les données."
      } finally {
        loading = false
      }
    }
    onMounted(fetchPokemons)
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