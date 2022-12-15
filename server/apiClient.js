import * as dotenv from 'dotenv'
dotenv.config()

export async function fetchGameBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/games/${slug}?key=${process.env.API_KEY}&search_precise=true`
	).catch((error)=>{
		console.log(error)
	});
	const game = await res.json();
	return game;
}

export async function fetchDeveloperBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/developers/${slug}?key=${process.env.API_KEY}`
	);
	const developer = await res.json();
	console.log(developer)
	return developer;
}

export async function fetchPlatformsBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/platforms/${slug}?key=${process.env.API_KEY}`
	);
	const platforms = await res.json();
	return platforms;
}

export async function fetchGenresBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/genres/${slug}?key=${process.env.API_KEY}&search_precise=true`
	);
	const genres = await res.json();
	return genres;
}