//const glob = require('glob-all')
const path = require('path')

module.exports = {
  env: {
    apiUrl: process.env.apiUrl
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Puskesmas Sibela",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "aplikasi bantu Puskesmas Sibela"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  css: [
    "@/node_modules/bootstrap/dist/css/bootstrap.css",
    "@/node_modules/bootstrap-vue/dist/bootstrap-vue.css"
	],

	plugins: [
		'@/plugins/vue-bootstrap',
		'@/plugins/vue-react'
	],
	
  build: {
    //analyze: true,
    /*
     ** Run ESLint on save
     */
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
		
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
	},
	
  modules: [
    "@nuxtjs/dotenv",
    [
      "@nuxtjs/moment",
      {
        locales: ["id"],
        defaultLocale: "id"
      }
    ]
  ]
};

