import express from "express"
import { Game } from "./controllers/game.js"
import { LOCAL_PORT } from "./globals.js"
import { getGameCode } from "./services/getGameCode.js"

const GAMES = []
const app = express()

app.post("/game/create", (_req, res) => {
	try {
		const game = new Game()
		const gameCode = game.getCode()
		GAMES.push(game)

		res.status(200).send({ gameCode })
	} catch(err) {
		res.status(500).send({ err })
	}
})

app.post("/game/:gameCode/delete", (req, res) => {
	const {gameCode, invalidGameCode, status, invalidGameCodeMessage} = getGameCode(req);
	if (invalidGameCode) {
		res.status(status).send(invalidGameCodeMessage)
	}

	const gameIndex = GAMES.findIndex(game => game.gameCode == gameCode)
	if (gameIndex < 0) {
		res.status(404).send(`Game not found. Probably incorrect game code sent - ${gameCode}`)
	}

	const deletedGame = GAMES.splice(gameIndex, 1);
	res.status(200).send({ deletedGame })
})

app.post("/game/:gameCode/questions", (req, res) => {
	const {gameCode} = req.params;
	if (!gameCode) {
		res.status(404).send(`Game Id (${gameCode}) not found`)
	}
})

app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})