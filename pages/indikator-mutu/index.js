import Strapi from 'strapi-sdk-javascript'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    data: () => ({
        sortBy: 'bagian',
        sortDesc: false,
        query: ""
    }),
    methods: {
        rowHover: (item, index, event) => console.log(JSON.stringify(item))
    },
    computed: {
        filteredMutu() {
            return this.mutus.filter(mutu => JSON.stringify(mutu).toLowerCase().includes(this.query.toLowerCase()))
        },
        fields() {
            return Object.keys(this.mutus[0]).map(e => ({ 
                key: e,
                sortable: true
            }))
        },
        mutus() {
            return this.$store.getters["mutus/list"];
        }
    },
    fetch: async ({ store }) => {
        store.commit("mutus/emptyList");
        const {
            data: { states }
        } = await strapi.request("post", "/graphql", {
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
            });

        const { indicators } = states[0];
        for(let i=0; i< indicators.length; i++) {
            const indicator = indicators[i]
            let push = {}
            if (indicator.counternames.length) {
                for (let counter of indicator.counternames) {
                    push[counter.countertype.name] = counter.name
                }
            }
            store.commit("mutus/add", Object.assign({
                bagian: indicator.bagian.nama,
                nama: indicator.name,
            }, push, {
                operator: indicator.operator.name,
                target: `${indicator.operator.name === '<=' ? `<= ` : ``}${indicator.target} ${indicator.satuan.name === 'persen' ? '%' : indicator.satuan.name}`,
                satuan: indicator.satuan.name
            }));
        }
    }

};