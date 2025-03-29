import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './store';
import { setupRouter } from './router';
import './main.css';
import './styles/mixin.less';
import './styles/var.less';

async function start() {
	const app = createApp(App);

	// 设置pinia
	setupStore(app);

	// 设置vue-router
	await setupRouter(app);

	app.mount('#app');
}

start();