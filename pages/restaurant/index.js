import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    data: () => ({
        query: ''
    }),
    computed: {
        filteredList() {
            return this.restaurants.filter( restaurant => restaurant.name.toLowerCase().includes(this.query.toLowerCase()))
        },
        restaurants() {
            return this.$store.getters['restaurants/list']
        }
    },
    fetch: async ({store}) => {
        store.commit('restaurants/emptyList')
        const { data : { restaurants }} = await strapi.request('post', '/graphql', {
            data: {
                query: `query {
                    restaurants {
                        _id
                        name
                        description
                        image {
                            url
                        }
                    }
                }`
            }
        })

        restaurants.forEach( restaurant => {
            restaurant.image.url = `${apiUrl}${restaurant.image.url}`
            store.commit('restaurants/add', {
                id: restaurant.id || restaurant._id,
                ...restaurant
            })
        })
    }
}