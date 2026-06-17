import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/Aura'
import 'primeicons/primeicons.css'


import App from './App.vue'
import { definePreset } from '@primeuix/themes'


const app = createApp(App)
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}'
    }
  }
})

app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
})
app.mount('#app')


