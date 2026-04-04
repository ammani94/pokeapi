<template>

  <form @submit.prevent="submitForm">
    <input v-model="search.name" placeholder="Rechercher..." required />
    <button @click="() => submitForm()">Rechercher</button>
  </form>
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
        <button @click="() => catchPokemons(listPokemons)"> Capturer</button>
      </div>
      
    </div>
    <div v-if="previous">
      <button @click="() => fetchPokemons(previous)"> Précédent</button>
    </div>
    <div v-if="next">
      <button @click="() => fetchPokemons(next)"> Suivant</button>
    </div>
  </div>  
</template>

<script>
import axios from 'axios'
import { ref, toRaw, onMounted } from 'vue'
import { useAppStore } from '../stores/user'
const store = useAppStore() 
export default {
  data() {
    return {
      pokemons: null,
      url: 'https://pokeapi.co/api/v2/pokemon/',
      listPokemon: null,
      next: null,
      previous: null,
      loading: false,
      error: null,
      formData: {
        api_id: '',
        name: ''
      },
      search: {
        name: ''
      }
    }
  },
  async mounted() {
    await this.fetchPokemons()
  },
  methods: {
    async fetchPokemons() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(this.url)
        this.listPokemon = response.data.results
        this.next = response.data.next
        this.previous = response.data.previous
        const pokemonDetails = await Promise.all(
          this.listPokemon.map(async (pokemon) => {
            const pokemonResponse = await axios.get(pokemon.url)
            return pokemonResponse.data
          })
        )
        this.pokemons = pokemonDetails
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        this.error = "Impossible de charger les données."
      } finally {
        this.loading = false
      }
    },
    async catchPokemons(listPokemon) {
      try {
        this.formData.api_id = listPokemon.id
        this.formData.name = listPokemon.name
        if (store.userSession.email !== undefined) {
          this.formData.userId = store.userSession.email
        }
        const response = await axios.post(
          'http://localhost:3000/catch',
          this.formData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        alert(response.data.message)
      } catch (error) {
        console.error("Erreur :", error)
      }
    },

    async submitForm() {
      try {
        const response = await axios.get(this.url+this.search.name)
        this.listPokemon = response.data
        this.pokemons = [this.listPokemon]
      } catch (err) {
        console.error("Erreur lors de la récupération:", err)
        this.error = "Pokémon non trouvé"
        this.searchData.name = ''
      } finally {
        this.loading = false
      }
    }
  },
};
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