import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'
import "@fontsource-variable/google-sans-flex";
import "@fontsource/abel";
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')