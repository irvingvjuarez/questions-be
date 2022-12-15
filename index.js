import express from "express"
import { Game } from "./controllers/game.js"
import { LOCAL_PORT } from "./globals.js"
import { getGame } from "./services/getGame.js"
import { getGameCode } from "./services/getGameCode.js"
import { getRequestParam } from "./services/getRequestParam.js"

const GAMES = []
const app = express()

app.use(express.json())

// GAME POST endpoints

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
	const {param: gameCode, isParamMissing} = getRequestParam(req.params.gameCode, res, "No game code Provided");
	if (isParamMissing) return

	const { gameIndex, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const deletedGame = GAMES.splice(gameIndex, 1);
	res.status(200).send({ deletedGame })
})

app.post("/game/:gameCode/questions", (req, res) => {
	const { body } = req
	const {gameCode, invalidGameCode, status, invalidGameCodeMessage} = getGameCode(req);
	if (invalidGameCode || !body) {
		const currentErrorMessage = body ? invalidGameCodeMessage : "Body not sent in the request"
		res.status(status).send(currentErrorMessage)
		return
	}

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	game.addQuestions(body.questions)
	res.status(200).send({ game })
})

app.post("/game/:gameCode/start", (req, res) => {
	const {gameCode, invalidGameCode, status, invalidGameCodeMessage} = getGameCode(req);
	if (invalidGameCode) {
		res.status(status).send(invalidGameCodeMessage)
		return
	}

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	if (!game.questions) {
		res.status(500).send("No questions added. Game cannot start")
		return
	}

	game.toggleStart();
	res.status(200).send({ game })
})

// USER POST endpoints
app.post("/user/:gameCode/join")

app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})