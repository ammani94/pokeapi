<template>
  <div>
    <button @click="isPopupOpen = true"> Créer une équipe</button>
    <Popup v-model="isPopupOpen">
      <TeamView @team-created="handleTeamCreated" />
    </Popup>

    <div>
      <select>
        <option v-for="team in teams" :key="team.name" @click="() => fetchPokemonsInTeams(team._id)">{{ team.name }}</option>
      </select>
    </div>

    <div v-if="pokemonsTeams" class="container element" >
      <div class="pokemon-card" v-for="pokemon in pokemonsTeams" :key="pokemon.name">
        <h2>{{ pokemon.name }} (ID: {{ pokemon.id }})</h2>
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
        <p>Types: {{ pokemon.types.map(t => t.type.name).join(', ') }}</p>
        <p>Poids: {{ pokemon.weight / 10 }} kg</p>
        <p>Taille: {{ pokemon.height / 10 }} m</p>
        <button @click="() => PokemonsOutOfTeam(pokemon.id_pokemon)"> Quitter </button>
      </div>
    </div>
    
    <div v-if="loading">Chargement en cours...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="pokemons" class="container element" >
      <div class="pokemon-card" v-for="pokemon in pokemons" :key="pokemon.name">
          <h2>{{ pokemon.name }} (ID: {{ pokemon.id }})</h2>
          <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
          <p>Types: {{ pokemon.types.map(t => t.type.name).join(', ') }}</p>
          <p>Poids: {{ pokemon.weight / 10 }} kg</p>
          <p>Taille: {{ pokemon.height / 10 }} m</p>
          <button @click="() => freePokemons(pokemon.id_pokemon)"> Libérer</button>
          <button @click="() => addPokemonToTeam(pokemon.id_pokemon)"> +</button>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, toRaw, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/user'
import Popup from './Popup.vue'
import TeamView from './TeamView.vue'
let store = useAppStore()
let isPopupOpen = ref(false)
let pokemons = ref(null)
let pokemonsTeams = ref(null)
let listPokemon = ref(null)
let teams = ref(null)
let loading = ref(null)
let error = ref(null)
let formData = ref({
        id_pokemon: ''
      })
let idTeam = ref(null)

const setIdTeam = async(id) => {
      idTeam.value = id;
    }

const fetchPokemonsInTeams = async(id) => {
      setIdTeam(id)
      try {
        const response = await axios.post('http://localhost:3000/fetch/team/'+idTeam.value, {
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
                id_pokemon: pokemon._id,
            }
          })
        )
        pokemonsTeams.value = pokemonDetails
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        error = "Impossible de charger les données."
      } finally {
        loading = false
      }
    }


const addPokemonToTeam = async(pokemon_id) => {
  const response = await axios.post('http://localhost:3000/'+idTeam.value+'/pokemons/'+pokemon_id, {
          user_id:store.userSession.email
        }, {
          withCredentials: true
        })
        alert(response.data.message)
        fetchPokemons()
        fetchPokemonsInTeams(idTeam.value)
    }

const PokemonsOutOfTeam = async(pokemon_id) => {
  const response = await axios.post('http://localhost:3000/pokemons/'+pokemon_id, {
          user_id:store.userSession.email
        }, {
          withCredentials: true
        })
        fetchPokemons()
        fetchPokemonsInTeams(idTeam.value)
    }

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
                id_pokemon: pokemon._id,
                pokemon_team: pokemon.team_id
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

    const fetchTeams = async() => {
      loading = true
      error = null
      try {
        const response = await axios.post('http://localhost:3000/fetchTeams', {
          user_id:store.userSession.email
        }, {
          withCredentials: true
        })
        teams.value = response.data.results
        fetchPokemonsInTeams(teams.value[0]._id)
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        error = "Impossible de charger les données."
      } finally {
        loading = false
      }
    }

    const handleTeamCreated = () => {
      isPopupOpen.value = false
      fetchTeams()
    }

    onMounted(fetchPokemons)
    onMounted(fetchTeams)
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


