import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		colors: ['white', 'black'],
		values: [true, false],
		initValue: true
	}
});

export default app;