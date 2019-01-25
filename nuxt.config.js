import PurgecssPlugin from 'purgecss-webpack-plugin'
import glob from 'glob-all'
import path from 'path'

module.exports = {
  env: {
    apiUrl: process.env.apiUrl
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Puskesmas Sibela',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'aplikasi bantu Puskesmas Sibela' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    babel: {
      plugins: ['babel-plugin-inline-import']
    },
    extractCSS: true,

    extend (config, { isDev, isClient }) {
      if (!isDev) {
        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        config.plugins.push(
          new PurgecssPlugin({
            paths: glob.sync([
              path.join(__dirname, './pages/**/*.vue'),
              path.join(__dirname, './layouts/**/*.vue'),
              path.join(__dirname, './components/**/*.vue')
            ]),
            whitelist: ['html', 'body']
          })
        )
      }
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/dotenv',
    ['@nuxtjs/moment', {
      locales: ['id'],
      defaultLocale: 'id'
    }]
  ]
}

