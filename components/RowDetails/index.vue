<template lang="pug">
b-card
	b-container
		dl
			.list-group-item
				b-row(align-h='end')
					b-button-group
						b-button(size='sm' v-if='harianApplied' variant='primary' @click.stop='rinci') {{rincishow}} harian
						b-button(size='sm' v-if='editing' variant='success' @click.stop='simpan') simpan
						b-button(size='sm' v-else variant='warning' @click.stop='toggleButton') edit
			.list-group-item
				b-row
					b-col.col-md-2
						dt.text-right Pembilang
					b-col
						dd {{row.item.pembilang}}
					b-col(cols='2')
						b-form-input.text-right(v-if='editing && !rincian' :placeholder='pembilang.toString()' v-model='pembilang')
						.text-right(v-else) {{pembilang}}
			.list-group-item
				b-row
					b-col.col-md-2
						dt.text-right Penyebut
					b-col
						dd {{row.item.penyebut}}
					b-col(cols='2')
						b-form-input.text-right(v-if='editing && !rincian'  :placeholder='penyebut.toString()' v-model='penyebut')
						.text-right(v-else) {{penyebut}}
	harian-detail(v-if='rincian' :month='month' :editing='editing' @rekapHarian='rekapHarian')
	b-container.mt-3
		.list-group
			.list-group-item
				b-row
					b-col.text-right Capaian
					b-col(cols='2') {{rekap}} 
			.list-group-item
				b-row
					b-col.text-right Target
					b-col(cols='2') {{row.item.target}}

</template>

<script src='./index.js'>
</script>