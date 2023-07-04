require('dotenv').config()
module.exports = {
	apollo: {
		clientConfigs: {
			default: {
				httpEndpoint: `${process.env.API_SIBELA}/graphql`,
			},
		}
	},
	axios: {
		baseURL: process.env.API_SIBELA,
		proxyHeaders: false,
		credentials: false
	},
	build: {
		babel: {
			plugins: [
				"babel-plugin-inline-import"
			]
		},
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
					test: /\.(js|vue|graphql)$/,
					loader: "eslint-loader",
					exclude: /(node_modules)/,
				});
			}
		},
		extractCSS: true,
	},
	css: [
		"@/node_modules/bootstrap/dist/css/bootstrap.css",
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
		],
		title: "Puskesmas Sibela",
	},
	loading: { color: "#3B8070" },
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/apollo',
		"@nuxtjs/dotenv",
		['@nuxtjs/pwa'],
		['@nuxtjs/moment', { locales: ['id'] }]
	],
	plugins: [
		{
			src: '~/plugins/auth',
			ssr: false
		},
	],
	server:{
		host: '0.0.0.0',
		port: 6060
	},
}

