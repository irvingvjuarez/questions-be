export const getGame = (GAMES, gameCode) => {
	const gameIndex = GAMES.findIndex(game => game.gameCode == gameCode)
	const game = GAMES[gameIndex]
	const gameNotFound = gameIndex < 0;

	const gameStatus = gameNotFound ? 404 : 200;
	const gameMessage = gameNotFound ? `Game not found. Probably incorrect game code sent - ${gameCode}` : ""

	return { gameIndex, game, gameNotFound, gameStatus, gameMessage }
}