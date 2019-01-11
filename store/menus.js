export const state = () => ({
    list: []
})

export const mutations = {
    add({ list }, restaurant) {
        list[list.length] = restaurant
    },
    emptyList({ list }) {
        list.length = 0
    }
}

export const getters = {
    list: ({ list }) => list
}