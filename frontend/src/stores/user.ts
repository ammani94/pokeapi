import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    userSession: {},
    pokemons: [],
  }),
  actions: {
    setUserSession(session: { email: string; userId: string }) {
      this.userSession = session
    },
  },
});