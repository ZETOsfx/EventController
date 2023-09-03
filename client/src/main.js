import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import mitt from 'mitt';
import { store } from './store/index'

const app = createApp(App);
app.config.globalProperties.emitter = mitt();

app
    .use(store)
    .use(router)
    .mount('#appa');