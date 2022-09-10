import express from 'express';
import path from 'path';
import { getGamesFromDeveloper } from './apiClient';

const port = process.env.port || 3000;
const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '../CSS')));
app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => console.log(`App opened on Port: ${port} `));

//pug template - working for login/signup pages
app.get('/signup', (req, res) => {
	res.render('pages/signup/signup');
});
app.get('/login', (req, res) => {
	res.render('pages/login/login');
});

app.get('/search', (req, res) => {
	res.render('pages/search/search');
});

//fetch and create game route
async function fetchGameBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/games/${slug}?key=073b26d4033244dfb59592b62994b56e&search_precise=true`
	);
	const game = await res.json();
	return game;
}

app.get('/game/:slug', async (req, res) => {
	const game = await fetchGameBySlug(req.params.slug);

	//removes html tags from game description
	let description = game.description;
	let gameDescription = description.replace(/(<([^>]+)>)/gi, '');

	res.render('pages/game/game', {
		name: `${game.name}`,
		description: `${gameDescription}`,
		rating: `${game.rating}`,
		website: `${game.website}`,
		platform: `${game.platform}`,
		released: `${game.released}`,
		image: `${game.background_image}`,
		alternate: `${game.background_image_additional}`,
	});
});

//fetch and create developer route - still needs to be attached to searchbar and anchored to /developers/slug
async function fetchDeveloperBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/developers/${slug}?key=073b26d4033244dfb59592b62994b56e`
	);
	const developer = await res.json();
	return developer;
}

app.get('/developer/:slug', async (req, res) => {
	const developer = await fetchDeveloperBySlug(req.params.slug);

	res.render('pages/developer/developer', {
		name: `${developer.name}`,
		games: `${developer.games}`,
		topgames: `${developer.top_games}`,
		image: `${developer.image_background}`,
	});
});

//fetch and create platform route
async function fetchPlatformsBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/platforms/${slug}?key=073b26d4033244dfb59592b62994b56e`
	);
	const platforms = await res.json();
	return platforms;
}
app.get('/platforms/:slug', async (req, res) => {
	const platform = await fetchPlatformsBySlug(req.params.slug);

	res.render('pages/platforms/platforms', {
		name: `${platform.name}`,
		year_start: `${platform.year_start}`,

		games_count: `${platform.games_count}`,
	});
});

//fetch and create genre route
async function fetchGenresBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/genres/${slug}?key=073b26d4033244dfb59592b62994b56e&search_precise=true`
	);
	const genres = await res.json();
	return genres;
}

app.get('/genre/:slug', async (req, res) => {
	const genre = await fetchGenresBySlug(req.params.slug);
	let description = genre.description;
	let genreDescription = description.replace(/(<([^>]+)>)/gi, '');
	res.render('pages/genre/genre', {
		name: `${genre.name}`,
		games: `${genre.games}`,
		game_ount: `${genre.games_count}`,
		image: `${genre.image_background}`,
		description: `${genreDescription}`,
	});
});

// testing pug template works
app.get('/test', (req, res) => {
	res.render('pages/search/search');
});

app.get('/home', (req, res) => {
	res.render('pages/home/home');
});
