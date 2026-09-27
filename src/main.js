import { createApp } from 'vue'; // Import createApp for Vue 3
import App from './App.vue';
import router from './router';
import store from './store';
import { loadBackground } from './background';

loadBackground();

const app = createApp(App); // Create the Vue 3 app instance

// Apply the router and store to the app
app.use(router);
app.use(store);

// Optionally, configure global settings (like axios settings, etc.)
// app.config.globalProperties.$http = axios; 

// Mount the app
app.mount('#app');
