import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    data: () => ({
        query: ''
    }),
    computed: {
        filteredList() {
            return this.menus.filter( menu => menu.name.toLowerCase().includes(this.query.toLowerCase()))
        },
        menus() {
            return this.$store.getters['menus/list']
        }
    },
    fetch: async ({store}) => {
        store.commit('menus/emptyList')
        const { data : { menus }} = await strapi.request('post', '/graphql', {
            data: {
                query: `query {
                    menus {
                        _id
                        name
                        description
                        url
                        image {
                            url
                        }
                    }
                }`
            }
        })

        menus.forEach( menu => {
            menu.image ? menu.image.url = `${apiUrl}${menu.image.url}` : ''
            store.commit('menus/add', {
                id: menu.id || menu._id,
                ...menu
            })
        })
    }
}