// fetch games from api
export function fetchGames(page = 1, search = '') {
	const res = fetch(
		`https://api.rawg.io/api/games?key=073b26d4033244dfb59592b62994b56e&search=${search}&page=${page}`
	).then((res) => res.json());
	return res;
}

// render games to DOM
function renderGames(games) {
	if (games.length !== 0) {
		const gamesContainer = document.getElementById('games-container');
		gamesContainer.innerHTML = '<h2> Games </h2';
		const gamesList = document.createElement('ul');
		gamesList.classList.add('container-list');
		games.forEach((game) => {
			const gameCard = document.createElement('li');
			gameCard.classList.add('game-card');
			gameCard.dataset.slug = game.slug;
			gameCard.innerHTML = `<a href="/game/${game.slug}" style="background-image: url(${game.background_image});"><span>${game.name}</span></a>`;

			gamesContainer.appendChild(gameCard);
		});
		// gamesContainer.appendChild(gamesList);
	}
}
// fetch develoeprs from api
export function fetchDevelopers(page = 1, search = '') {
	const res = fetch(
		`https://api.rawg.io/api/developers?key=073b26d4033244dfb59592b62994b56e&search=${search}&page=${page}`
	).then((res) => res.json());
	return res;
}
//render developers to dom
function renderDevelopers(developers) {
	if (developers.length !== 0) {
		const developerContainer = document.getElementById('developers-container');
		developerContainer.innerHTML = '<h2>Developers</h2> ';
		const developerList = document.createElement('ul');
		developerList.classList.add('container-list');
		developers.forEach((developer) => {
			const developerCard = document.createElement('li');
			developerCard.classList.add('developer-card');
			developerCard.dataset.slug = developer.slug;
			developerCard.innerHTML = `<a href="/developer/${developer.slug}" style="background-image: url(${developer.image_background});"><span>${developer.name}</span></a>`;

			developerList.appendChild(developerCard);
		});
		developerContainer.appendChild(developerList);
	}
}
// fetch platforms from api
export function fetchPlatforms(page = 1, search = '') {
	const res = fetch(
		`https://api.rawg.io/api/platforms?key=073b26d4033244dfb59592b62994b56e&search=${search}&page=${page}`
	).then((res) => res.json());
	return res;
}
//render platforms to dom
function renderPlatforms(platforms) {
	if (platforms.length !== 0) {
		const platformContainer = document.getElementById('platforms-container');

		platformContainer.innerHTML = '<h2>Platforms</h2>';
		const platformsList = document.createElement('ul');
		platformsList.classList.add('container-list');
		platforms.forEach((platform) => {
			const platformCard = document.createElement('li');
			platformCard.classList.add('platform-card');
			platformCard.dataset.slug = platform.slug;
			platformCard.innerHTML = `<a href="/platforms/${platform.slug}" style="background-image: url(${platform.image_background});"><span>${platform.name}</span></a>`;
			platformsList.appendChild(platformCard);
		});
		platformContainer.appendChild(platformsList);
	}
}
// fetch genres from api
export function fetchGenres() {
	const res = fetch(
		`https://api.rawg.io/api/genres?key=073b26d4033244dfb59592b62994b56e`
	).then((res) => res.json());
	return res;
}
//render genres to dom
function renderGenres(genres) {
	if (genres.length !== 0) {
		const genreContainer = document.getElementById('genres-container');
		genreContainer.innerHTML = '<h2>Genres</h2>';
		const genresList = document.createElement('ul');
		genresList.classList.add('container-list');
		genres.forEach((genre) => {
			const genreCard = document.createElement('li');
			genreCard.classList.add('genre-card');
			genreCard.dataset.slug = genre.slug;
			genreCard.innerHTML = `<a href="/genre/${genre.slug}" style="background-image: url(${genre.image_background});"><span>${genre.name}</span></a>`;
			genresList.appendChild(genreCard);
		});
		genreContainer.appendChild(genresList);
	}
}

// search function
const searchBar = document.querySelector('.search-bar');

async function searchRequest(e) {
	let searchField = e.target.value;

	document.getElementById('games-container').innerHTML = '';
	document.getElementById('developers-container').innerHTML = '';
	document.getElementById('platforms-container').innerHTML = '';
	document.getElementById('genres-container').innerHTML = '';

	//games - filter games by input value

	let games = await fetchGames(1, searchField);
	const filteredGames = games.results.filter((game) => {
		const gameSearch = game.name;
		if (gameSearch.toLowerCase().includes(searchField.toLowerCase())) {
			return true;
		}

		return false;
	});

	//developers

	let developer = await fetchDevelopers(1, searchField.value);

	const filteredDevelopers = developer.results.filter((developer) => {
		const developerSearch = developer.name;
		if (developerSearch.toLowerCase().includes(searchField.toLowerCase())) {
			return true;
		}

		return false;
	});
	// platforms:
	let platform = await fetchPlatforms(1, searchField);
	const filteredPlatforms = platform.results.filter((platform) => {
		const platformSearch = platform.name;
		if (platformSearch.toLowerCase().includes(searchField.toLowerCase())) {
			return true;
		}

		return false;
	});

	//genres
	let genres = await fetchGenres(1, searchField);
	const filteredGenres = genres.results.filter((genre) => {
		const genreSearch = genre.name;
		if (genreSearch.toLowerCase().includes(searchField.toLowerCase())) {
			return true;
		}

		return false;
	});

	//render all params
	if (searchField !== '') {
		renderGames(filteredGames);
		renderDevelopers(filteredDevelopers);
		renderPlatforms(filteredPlatforms);
		renderGenres(filteredGenres);
	}

	return;
}
// debounce
function debounce(callback, delay) {
	let timeout;
	return function (e) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			callback(e);
		}, delay);
	};
}

searchBar.addEventListener('input', debounce(searchRequest, 500));

export { renderGenres };
export { renderGames };
export { renderDevelopers };
export { renderPlatforms };
