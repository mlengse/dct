<template lang="pug">
section.container
	.row.mt-2
		h3 Posyandu Balita 
	.row.mt-2
		h5 {{ lowerCase(posyandu.name) }} RW {{ posyandu.rw }}
</template>

<script>
import gql from 'graphql-tag'
import posyById from '~/apollo/queries/getPosyanduById.gql'
export default {
	data: () => ({
		posyandu: {
			name: '',
			rw: ''
		}
	}),
	computed: {
		_key() {
			return `posy-${this.$route.params.id.toUpperCase()}`
		}
	},
	
	methods: {
		lowerCase(string) {
			return string.split(' ').map(e=> {
				return e.charAt(0) + e.slice(1).toLowerCase();
			}).join(' ')
		},
	},

	apollo: {
		posyandu: {
			query: posyById,
			variables() {
				return {
					id: this._key
				}
			},
			update: ({ posyandu }) => posyandu
		},
	}

}
</script>
