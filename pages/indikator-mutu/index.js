import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    computed: {
        mutus() {
            return this.$store.getters['mutus/list']
        }
    },
    fetch: async ({ store }) => {
        const { data: { states } } = await strapi.request(
          "post",
          "/graphql",
          {
            data: {
              query: `query {
                        states ( where: {
                        name: "mutu"
                    }) {
                        name
                        indicators{
                        name
                        counternames {
                            name
                            countertype {
                            name
                            }
                        }
                        operator {
                            name
                        }
                        target
                        satuan {
                            name
                        }
                        bagian {
                            nama
                        }
                        }
                    }
                }`
            }
          }
        );

        const {indicators} = states[0]

        indicators.forEach(indicator => {
            store.commit('mutus/add', {
                bagian: indicator.bagian.nama,
                nama: indicator.name,
                operator: indicator.operator.name,
                target: indicator.target,
                satuan: indicator.satuan.name,

            })
        })
    }
}