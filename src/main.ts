import './assets/main.css';

import { createApp } from 'vue';
import ymaps3 from '@/plugins/yandexMap/yandexMap.ts'
import { createPinia } from 'pinia';
import App from './App.vue';

const app = createApp(App);
app.use(ymaps3)
app.use(createPinia());

app.mount('#app');
