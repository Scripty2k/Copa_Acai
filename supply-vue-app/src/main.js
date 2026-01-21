import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import appFirebase from "./firebase";
import './assets/styles/global.css';

createApp(App).use(router).mount("#app");