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
	}
}