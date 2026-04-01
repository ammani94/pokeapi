<template>
  <div> 
      <div class="pokemon-card" v-for="pokemon in pokemons" :key="pokemon.name">
        <h2>{{ pokemon.name }} (ID: {{ pokemon.id }})</h2>
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
        <p>Types: {{ pokemon.types.map(t => t.type.name).join(', ') }}</p>
        <p>Poids: {{ pokemon.weight / 10 }} kg</p>
        <p>Taille: {{ pokemon.height / 10 }} m</p>
        <button @click="() => freePokemons(pokemon.id_pokemon)"> Libérer</button>
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
        listPokemon = response.data.results
        const pokemonDetails = await Promise.all(
          listPokemon.map(async (pokemon) => {
            const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemon.api_id)
            return {
                ...pokemonResponse.data,
                id_pokemon: pokemon._id
            }
          })
        )
        pokemons = pokemonDetails
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
        listPokemon = response.data.results
        const pokemonDetails = await Promise.all(
          listPokemon.map(async (pokemon) => {
            const pokemonResponse = await axios.get('https://pokeapi.co/api/v2/pokemon/'+pokemon.api_id)
            return {
                ...pokemonResponse.data,
                id_pokemon: pokemon._id
            }
          })
        )
        pokemons = pokemonDetails
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