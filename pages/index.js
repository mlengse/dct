import Strapi from 'strapi-sdk-javascript'
import query from './query.graphql'
const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    data: () => ({
        query: ''
    }),
    computed: {
        filteredList() {
            return this.menus.filter( menu => menu.nama.toLowerCase().includes(this.query.toLowerCase()))
        },
        menus() {
            return this.$store.getters['menus/list']
        }
    },
    fetch: async ({store}) => {
        store.commit('menus/emptyList')
        const { data : { menus }} = await strapi.request('post', '/graphql', {
            data: {
                query
            }
        })

        menus.forEach( menu => {
//            menu.cover? menu.cover.url ? '' : menu.cover.url = `${apiUrl}${menu.cover.url}` : ''
            store.commit('menus/add', {
                id: menu.id || menu._id,
                ...menu
            })
        })
    }
}