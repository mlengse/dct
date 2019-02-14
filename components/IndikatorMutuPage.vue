<template lang="pug">
b-container(fluid)
	.row
		.col-md-12
			h3 Indikator Mutu
	.row
		.col-md-12
			month-picker(@updateMonth='updateMonth' :loading='loaded')
	.row
		.col-md-12
			.form-group.mt-3
				input.form-control(v-model='query' type='text' placeholder='Search...')
	.row
		.col-md-12
			b-table(
				show-empty
				hover 
				small
				responsive 
				:items="mutus"
				:fields="fields" 
				:current-page="currentPage" 
				:per-page="perPage" 
				:busy.sync='loaded' 
				:sort-by.sync="sortBy" 
				:sort-desc.sync="sortDesc" 
				:filter='query'
				@filtered='onFiltered'
			)
				template(slot='capaian' slot-scope='row')
					status-capaian(:mutu='row.item' :month='month')
				template(slot="action" slot-scope="row")
					b-button-group.mx-1(size='sm')
						b-btn(
							size='sm'
							variant='outline-primary' 
							@click.stop="row.toggleDetails"
							v-text='`${row.detailsShowing ? "Tutup":"Buka"} Input`'
						)
						//b-btn( size='sm' variant='outline-primary' @click.stop="info(row.item, row.index, $event.target)" ) Info
				template(slot="row-details" slot-scope="row")
					row-details(:row='row' :month='month')
	.row
		.col-md-12
			b-pagination(:total-rows="totalRows" :per-page="perPage" v-model="currentPage")
	//b-modal#modalInfo(@hide='resetModal' :title='modalInfo.title' ok-only)
		pre {{modalInfo.content}}

</template>

<script>
import MonthPicker from '~/components/MonthPicker.vue'
import RowDetails from '~/components/RowDetails.vue'
import StatusCapaian from '~/components/StatusCapaian.vue'
//import BTable from "~/node_modules/bootstrap-vue/es/components/table/table";

export default {
	props:[
		'month',
		'loaded'
	],
	components: {
		//'b-table': BTable,
		StatusCapaian,
		MonthPicker,
		RowDetails
	},
	data: () => ({
		sortBy: null,
		sortDesc: false,
		query: null,
		perPage: 10,
		currentPage: 1,
		totalRows: 0,
		modalInfo: { title: '', content: '' }
	}),
	methods: {
		onFiltered(filteredItems) {
			this.totalRows = filteredItems.length
			this.currentPage = 1
		},
		updateMonth(val) {
			if (this.month !== val) {
				this.$emit('updateMonth', val)
			}
		},
		showing(row) {
			return row._showDetails
		},
		info(item, index, button) {
			this.modalInfo.title = `Row index: ${index}`
			this.modalInfo.content = JSON.stringify(item, null, 2)
			this.$root.$emit('bv::show::modal', 'modalInfo', button)
		},
		resetModal() {
			this.modalInfo.title = ''
			this.modalInfo.content = ''
		}
	},
	watch: {
		mutus(val) {
			this.totalRows = val.length
		}
	},
	computed: {
		fields: () => ['bagian', 'indikator', 'capaian', 'action'].map(e => ({
			key: e,
			sortable: true
		})),
		mutus() {
			return this.$store.getters['data/mutus'].map(mutu => ({
				...mutu,
				_showDetails: mutu._showDetails || false,
			}))
		}
	}
};
</script>

<!--style lang="scss">
@import "~/node_modules/bootstrap/scss/_functions.scss";
$sizes: ();

@import "~/node_modules/bootstrap/scss/_variables.scss";
@import "~/node_modules/bootstrap/scss/_mixins.scss";
@import "~/node_modules/bootstrap/scss/_root.scss";
@import "~/node_modules/bootstrap/scss/_reboot.scss";
@import "~/node_modules/bootstrap/scss/_type.scss";
//@import "~/node_modules/bootstrap/scss/_images.scss";
//@import "~/node_modules/bootstrap/scss/_code.scss";
@import "~/node_modules/bootstrap/scss/_grid.scss";
@import "~/node_modules/bootstrap/scss/_tables.scss";
@import "~/node_modules/bootstrap/scss/_forms.scss";
@import "~/node_modules/bootstrap/scss/_buttons.scss";
//@import "~/node_modules/bootstrap/scss/_transitions.scss";
//@import "~/node_modules/bootstrap/scss/_dropdown.scss";
@import "~/node_modules/bootstrap/scss/_button-group.scss";
//@import "~/node_modules/bootstrap/scss/_input-group.scss";
//@import "~/node_modules/bootstrap/scss/_custom-forms.scss";
@import "~/node_modules/bootstrap/scss/_nav.scss";
@import "~/node_modules/bootstrap/scss/_navbar.scss";
//@import "~/node_modules/bootstrap/scss/_card.scss";
//@import "~/node_modules/bootstrap/scss/_breadcrumb.scss";
@import "~/node_modules/bootstrap/scss/_pagination.scss";
@import "~/node_modules/bootstrap/scss/_badge.scss";
//@import "~/node_modules/bootstrap/scss/_jumbotron.scss";
//@import "~/node_modules/bootstrap/scss/_alert.scss";
//@import "~/node_modules/bootstrap/scss/_progress.scss";
//@import "~/node_modules/bootstrap/scss/_media.scss";
@import "~/node_modules/bootstrap/scss/_list-group.scss";
@import "~/node_modules/bootstrap/scss/_close.scss";
//@import "~/node_modules/bootstrap/scss/_toasts.scss";
@import "~/node_modules/bootstrap/scss/_modal.scss";
//@import "~/node_modules/bootstrap/scss/_tooltip.scss";
//@import "~/node_modules/bootstrap/scss/_popover.scss";
//@import "~/node_modules/bootstrap/scss/_carousel.scss";
//@import "~/node_modules/bootstrap/scss/_spinners.scss";
@import "~/node_modules/bootstrap/scss/_utilities.scss";
//@import "~/node_modules/bootstrap/scss/_print.scss";
</style--!>
