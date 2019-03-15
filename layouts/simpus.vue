<template lang='pug'>
#container
	#header
		.head1.clearfix
			.kiri
			.tengah
				h1 SISTEM INFORMASI MANAJEMEN PUSKESMAS
			.kanan
	nuxt
	#footer
		p Program ini dikembangkan oleh 
			a TIM SIMPUS
</template>
<script>
export default {
		head: () => ({
		link: [
			{
				rel: "stylesheet",
				type:"text/css",
				href:"/j-care/css/default.css"
			}
		],
		script: [
			{
				type:"text/javascript",
				src:"/j-care/js/jquery-1.6.min.js"
			},
			{
				type:"text/javascript",
				src:"/j-care/js/jquery-ui-1.8.16.custom.min.js"
			},
			{
				type:"text/javascript",
				src:"/j-care/js/jquery.colorbox-min.js"
			},
			{
				type:"text/javascript",
				src:"/j-care/js/jquery.watermark.min.js"
			},
			{
				type:"text/javascript",
				src:"/j-care/js/jquery.meio.mask.min.js"
			},
			{
				type: "text/javascript",
				src:"/j-care/js/menu/superfish.js"
			},
			{
				type:"text/javascript",
				src:"/j-care/js/menu/hoverIntent.js"
			},{
				type:"text/javascript",
				src:"/j-care/js/menu/supersubs.js"
			},{
				type:"text/javascript",
				src:"/j-care/js/jquery.msc.js"
			},{
				type:"text/javascript",
				src:"/j-care/js/chart.js"
			},{
				type:"text/javascript",
				src:"/j-care/js/chart/highcharts.js"
			}
		]
	})

}
</script>