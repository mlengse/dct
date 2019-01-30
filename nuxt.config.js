//const glob = require('glob-all')
//const path = require('path')

module.exports = {
	/*
	** Build configuration
	*/

	build: {
		//analyze: true,

		babel: {
			plugins: [
				[
					'module-resolver', {
						'root': ['.'],
						'alias': {
							'react': 'nervjs',
							'react-dom': 'nervjs'
						}
					}
				],
				"babel-plugin-inline-import"
			]
		},
		
		/*
		 ** Run ESLint on save
		 */
		extend(config, { isDev, isClient }) {

			if (isDev && isClient) {
				config.module.rules.push({
					enforce: "pre",
					test: /\.(js|vue)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/
				});
			}
		},

		extractCSS: true,

	},
	
	css: [
	//	"@/node_modules/bootstrap/dist/css/bootstrap.css",
	//	'@/node_modules/buefy/dist/buefy.css',
	//	"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css"
	],

	env: {
		apiUrl: process.env.apiUrl
	},

	/*
	 ** Headers of the page
	 */
	head: {
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{
				hid: "description",
				name: "description",
				content: "aplikasi bantu Puskesmas Sibela"
			}
		],
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		title: "Puskesmas Sibela",
	},
	
	/*
	 ** Customize the progress bar color
	 */
	loading: { color: "#3B8070" },

	modules: [
	//	'nuxt-buefy',
	//	'nuxt-purgecss',
		"@nuxtjs/dotenv",
		['@nuxtjs/moment', { locales: ['id'] }]
	],

	plugins: [
		'@/plugins/vue-buefy',
		'@/plugins/vue-bootstrap',
		'@/plugins/vue-react'
	],
	
};

