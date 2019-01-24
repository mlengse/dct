import Strapi from 'strapi-sdk-javascript'
import query from './query.graphql'

const apiUrl = process.env.apiUrl || 'http://localhost:1337'

const strapi = new Strapi(apiUrl)

export default async (store, month) => {
    store.commit("mutus/emptyList");
    const {
        data: { states }
    } = await strapi.request("post", "/graphql", {
        data: {
            query,
            variables: {
                name: 'mutu',
                month: month || this.$moment().format('MMMM YYYY')
            }
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
            id: indicator._id,
            bagian: indicator.bagian.nama,
            indikator: indicator.name,
       }, push, {
            operator: indicator.operator.name,
            numtarget: indicator.target,
            satuan: indicator.satuan.name,
            target: `${indicator.operator.name === '<=' ? `<= ` : ``}${indicator.target} ${indicator.satuan.name === 'persen' ? '%' : indicator.satuan.name}`,
            rekap: indicator.rekaps[0]
        }));
    }
}