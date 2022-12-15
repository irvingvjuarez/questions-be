import express from "express"
import { Game } from "./controllers/game.js"
import { LOCAL_PORT } from "./globals.js"

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

app.post("/game/:gameCode/finish", (req, res) => {
	const gameCode = req.params.gameCode;
	if (!gameCode) {
		res.status(404).send(`Game Id (${gameCode}) not found`)
	}

	const gameIndex = GAMES.findIndex(game => game.gameCode == gameCode)
	if (gameIndex < 0) {
		res.status(404).send(`Game not found. Probably incorrect game code sent - ${gameCode}`)
	}

	const deletedGame = GAMES.splice(gameIndex, 1);
	res.status(200).send({ deletedGame })
})

app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})