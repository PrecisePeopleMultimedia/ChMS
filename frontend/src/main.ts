import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dark, Notify } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import our modern styles
import './styles/globals.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Quasar, {
  plugins: {
    Dark,
    Notify
  },
  config: {
    dark: false, // Will be controlled by theme store
    brand: {
      primary: '#8B1538',
      secondary: '#4A1A2C',
      accent: '#B8336A',
      dark: '#1A0A0F',
      positive: '#21BA45',
      negative: '#C10015',
      info: '#31CCEC',
      warning: '#F2C037'
    }
  }
})

// Initialize theme after app is created
app.mount('#app')

// Initialize theme store after mounting
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initializeTheme()
