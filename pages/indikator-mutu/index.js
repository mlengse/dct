import Strapi from 'strapi-sdk-javascript'
import query from './query.graphql'
const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default {
    data: () => ({
        sortBy: 'bagian',
        sortDesc: false,
        query: "",
        perPage: 5,
        currentPage: 1
    }),
    methods: {
        rowHover: (item, index, event) => /*console.log(JSON.stringify(item))*/''
    },
    computed: {
        filteredMutu() {
            return this.mutus.filter(mutu => JSON.stringify(mutu).toLowerCase().includes(this.query.toLowerCase()))
        },
        fields() {
            return ['bagian', 'indikator', 'target', 'action'].map(e => ({ 
                key: e,
                sortable: true
            }))
        },
        totalRows() {
            return this.filteredMutu.length
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
                query 
            }
            });

        const { indicators } = states[0];
        for(let i=0; i< indicators.length; i++) {
            const indicator = indicators[i]
           // console.log(JSON.stringify(indicator._id))

            let push = {}
            //console.log(indicator.counternames.length)

            if (indicator.counternames.length) {
                for (let counter of indicator.counternames) {
                    push[counter.countertype.name] = counter.name
                }
            }

            store.commit("mutus/add", Object.assign({
                id: indicator._id,
                bagian: indicator.bagian.nama,
                indikator: indicator.name,
           }, push, {
                operator: indicator.operator.name,
                numtarget: indicator.target,
                satuan: indicator.satuan.name,
                target: `${indicator.operator.name === '<=' ? `<= ` : ``}${indicator.target} ${indicator.satuan.name === 'persen' ? '%' : indicator.satuan.name}`
            }));
        }
    }

};