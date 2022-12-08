
export function getGamesFromDeveloper(gameSlug) {
	const games = getGames();
	const game = games.filter((game) => {
		return game.slug === gameSlug;
	});
	if (game.length) {
		return game[0].slug;
	}
}

export async function fetchGameBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/games/${slug}?key=073b26d4033244dfb59592b62994b56e&search_precise=true`
	).catch((error)=>{
		console.log(error)
	});
	const game = await res.json();
	return game;
}


export async function fetchDeveloperBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/developers/${slug}?key=073b26d4033244dfb59592b62994b56e`
	);
	const developer = await res.json();
	return developer;
}

export async function fetchPlatformsBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/platforms/${slug}?key=073b26d4033244dfb59592b62994b56e`
	);
	const platforms = await res.json();
	return platforms;
}

export async function fetchGenresBySlug(slug) {
	const res = await fetch(
		`https://api.rawg.io/api/genres/${slug}?key=073b26d4033244dfb59592b62994b56e&search_precise=true`
	);
	const genres = await res.json();
	return genres;
}