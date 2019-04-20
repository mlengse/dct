//const glob = require('glob-all')
//const path = require('path')
require('dotenv').config()
module.exports = {
	/*
	** Build configuration
	*/
	apollo: {
		//tokenName: 'token',
		//tokenName: 'yourApolloTokenName', // optional, default: apollo-token
		//tokenExpires: 10, // optional, default: 7 (days)
		//includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
		//authenticationType: 'Basic', // optional, default: 'Bearer'
		// optional
		//errorHandler(error) {
		//	console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
		//},
		// required
		clientConfigs: {
			default: {
				// required  
				httpEndpoint: `${process.env.API_SIBELA}/graphql`,
				// optional
				// See https://www.apollographql.com/docs/link/links/http.html#options
				//httpLinkOptions: {
				//	credentials: 'same-origin'
				//},
				// You can use `wss` for secure connection (recommended in production)
				// Use `null` to disable subscriptions
				//wsEndpoint: `${process.env.API_SIBELA}/graphql`, // optional
				// LocalStorage token
				//tokenName: 'apollo-token', // optional
				// Enable Automatic Query persisting with Apollo Engine
				//persisting: false, // Optional
				// Use websockets for everything (no HTTP)
				// You need to pass a `wsEndpoint` for this to work
				//websocketsOnly: true // Optional
			},
			//test: {
				//httpEndpoint: 'http://localhost:5000',
				//wsEndpoint: 'ws://localhost:5000',
				//tokenName: 'apollo-token'
			//},
			// alternative: user path to config which returns exact same config options
			//test2: '~/plugins/my-alternative-apollo-config.js'
		}

	},

	axios: {
		baseURL: process.env.API_SIBELA,
		proxyHeaders: false,
		credentials: false
	},

	build: {
		//analyze: true,

		babel: {
			plugins: [
				/*
				[
					'module-resolver', {
						'root': ['.'],
						'alias': {
							'react': 'nervjs',
							'react-dom': 'nervjs',
						}
					}
				],
				*/
				"babel-plugin-inline-import"
			]
		},
		
		/*
		 ** Run ESLint on save
		 */
		extend(config, { isDev, isClient }) {
			config.resolve.alias['./dist/cpexcel.js'] = ''
			if(isClient) {
				config.node = {
					fs: 'empty'
				}

			}
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: "pre",
					//test: /\.(js|vue)$/,
					test: /\.(js|vue|graphql)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/,
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
				hid: "Aplikasi Bantu Puskesmas (ABAP)",
				name: "Puskesmas Sibela",
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
		'@nuxtjs/apollo',
	//	'@nuxtjs/toast',
		"@nuxtjs/dotenv",
		['@nuxtjs/pwa'],
		['@nuxtjs/moment', { locales: ['id'] }]
	],

	plugins: [
		//'@/plugins/vue-buefy',
	//	'@/plugins/vue-bootstrap',
		{
			src: '~/plugins/auth',
			ssr: false
		},
		//{ 
		//	src: '~plugins/download', 
		//	ssr: false 
		//}
		//'@/plugins/vue-react',
		//'@/plugins/firebase'
	],

	//purgeCSS: {
	//	enabled: true
		// your settings here
	//},
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

