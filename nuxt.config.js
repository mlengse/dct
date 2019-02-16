//const glob = require('glob-all')
//const path = require('path')

module.exports = {
	/*
	** Build configuration
	*/
	axios: {
		baseURL: process.env.API_SIBELA,
		proxyHeaders: false,
		credentials: false
	},

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
					test: /\.(js|vue|graphql)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/
				});
			}
		},

		extractCSS: true,

		
	},
	
	css: [
	//	'~/assets/css/style.css'

		"@/node_modules/bootstrap/dist/css/bootstrap.css",
	//	'@/node_modules/buefy/dist/buefy.css',
		"@/node_modules/bootstrap-vue/dist/bootstrap-vue.css"
	],

	env: {
		API_URL: process.env.API_URL,
		API_SIBELA: process.env.API_SIBELA,
		apiUrl: process.env.apiUrl,
		apiKey: process.env.apiKey,
		authDomain: process.env.authDomain,
		databaseURL: process.env.databaseURL,
		projectId: process.env.projectId,
		storageBucket: process.env.storageBucket,
		messagingSenderId: process.env.messagingSenderId,
		strapiUser: process.env.strapiUser,
		strapiPwd: process.env.strapiPwd
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
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
//			{type:"text/css", rel:"stylesheet", href:"https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth.css"}
		],
		title: "Puskesmas Sibela",
//		script: [{ src:"https://www.gstatic.com/firebasejs/ui/3.5.2/firebase-ui-auth__id.js"}],
	},
	/*
	 ** Customize the progress bar color
	 */
	loading: { color: "#3B8070" },

	modules: [
	//	'nuxt-buefy',
	//	'nuxt-purgecss',
		'@nuxtjs/axios',
	//	'@nuxtjs/toast',
		"@nuxtjs/dotenv",
		['@nuxtjs/pwa', { icon: false }],
		['@nuxtjs/moment', { locales: ['id'] }]
	],

	plugins: [
		//'@/plugins/vue-buefy',
		'@/plugins/vue-bootstrap',
		{
			src: '~/plugins/auth',
			ssr: false
		}
		//'@/plugins/vue-react',
		//'@/plugins/firebase'
	],
	server:{
		host: '0.0.0.0',
		port: 6060
	},
/*	
	toast: {
		position: 'top-right',
		duration: 1200
	}
*/
}

