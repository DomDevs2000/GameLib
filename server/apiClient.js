export function getGamesFromDeveloper(gameSlug) {
	const games = getGames();
	const game = games.filter((game) => {
		return game.slug === gameSlug;
	});
	if (game.length) {
		console.log(gameSlug);
		return game[0].slug;
	}
}
