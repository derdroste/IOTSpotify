<script>
	import { onMount } from 'svelte';

	let token;
	let refresh = 10000;
	let playlists = [];

	onMount(async () => {
		await getToken();
		setInterval(() => {
			getToken();
		}, refresh);

		await getPlaylists();
	});

	const getToken = async () => {
		const res = await fetch(`http://192.168.178.27:8888/token`);
		const data = await res.json();
		token = data.token;
		refresh = data.refresh;
	}

	const getPlaylists = async () => {
		const res = await fetch(`http://192.168.178.27:8888/playlists/${token}`);
		playlists = await res.json();
	}

	const play = () => {
		fetch(`http://192.168.178.27:8888/player`, {
			method: 'POST'
		})
	}
</script>

<main>
	{#each playlists as playlist}
		<button on:click={play}>{playlist}</button>
	{/each}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
