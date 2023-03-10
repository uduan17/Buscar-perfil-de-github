const API = "https://api.github.com/users/";


const app = Vue.createApp({
  data() {
    return {
      search: null,
      result: null,
      error: null,
      favorites: new Map()
    };
  },

  created() {
    const saveFavorites = JSON.parse(window.localStorage.getItem('favorites'))
    if (saveFavorites?.length) {
      const favorites = new Map(saveFavorites.map(favorite => [favorite.login, favorite]))
      this.favorites = favorites
    }
  },

  computed: {
    isFavorite() {
      return this.favorites.has(this.result.login)
    },
    allFavorites() {
      return Array.from(this.favorites.values())
    }
  },

  methods: {
    async doSearch() {
      this.result = this.error = false

      const foundInFavorites = this.favorites.get(this.search)

      if (!!foundInFavorites) {
        return this.result = foundInFavorites
      }

      try {
        const response = await fetch(API + this.search)
        if (!response.ok) throw new Error("User not found")
        const data = await response.json()
        console.log(data);
        this.result = data
      } catch (error) {
        this.error = error
      } finally {
        this.search = null
      }
    },

    addFavorite() {
      this.result.lasRequestTime = Date.now()
      this.favorites.set(this.result.login, this.result)
      this.updateStorage()
    },

    removeFavorite() {
      this.favorites.delete(this.result.login)
      console.log(this.favorites, 'No hay favoritos');
      this.updateStorage()
    },

    showFavorite(favorite) {
      this.result = favorite
    },

    updateStorage() {
      window.localStorage.setItem('favorites', JSON.stringify(this.allFavorites))
    }

  }
});

const mountedApp = app.mount('#app')   