
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Videojuego Radge',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Manager para reservar tareas.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { type: 'application/javascript', src: '/js/snap.svg-min.js' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@plugins/global.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/vuetify-module
    '@nuxtjs/vuetify',
  ],
  vuetify: {
    /* module options */
    font: {
      family: 'Roboto'
    },
    theme: {
      themes: {
        light: {
          primary: '#54B5EE',
          secondary: '#424242',
          accent: '#BCE0FD',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
        }
      }
    },
  },
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: ['fas']
          },
          {
            set:'@fortawesome/free-brands-svg-icons',
            icons: ['fab']
          }
        ]
      },
    ]
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL:  'http://127.0.0.1:8000',//'{BASE_URL_OF API}/', http://127.0.0.1:8000 | http://api-radge.valentigamez.com
    credentials: true
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
