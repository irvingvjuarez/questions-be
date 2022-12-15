export const getGameCode = (req) => {
	const {gameCode} = req.params;
	const invalidGameCode = !gameCode;
	const status = invalidGameCode ? 404 : 200;
	const invalidGameCodeMessage = invalidGameCode ? `Game Id (${gameCode}) not found` : ""

	return { gameCode, invalidGameCode, status, invalidGameCodeMessage }
}