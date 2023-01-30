import express from "express"
import { Game } from "../controllers/game.js"
import { AUTO_DESTROYING_TIMESPAN, GAMES } from "../globals.js"
import { getGame } from "../services/getGame.js"
import { getRequestParam } from "../services/getRequestParam.js"

const router = express.Router()

// GAME POST endpoints
router.post("/create", (req, res) => {
	const { param: questions, isParamMissing: questionsMissing } = getRequestParam(req.body.questions, res, "Questions not sent in the body request")
	if (questionsMissing) return

	try {
		const game = new Game()
		GAMES.push(game)

		const gameCode = game.getCode()
		game.addQuestions(questions)

		setTimeout(() => {
			const { gameIndex, gameNotFound } = getGame(GAMES, gameCode)
			if (!gameNotFound) {
				GAMES.splice(gameIndex, 1)
			}
		}, AUTO_DESTROYING_TIMESPAN)

		res.status(200).send({ gameCode })
	} catch(err) {
		res.status(500).send({ err })
	}
})

router.post("/:gameCode/delete", (req, res) => {
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

router.post("/:gameCode/questions", (req, res) => {
	const { param: questions, isParamMissing: questionsMissing } = getRequestParam(req.body.questions, res, "Questions not sent in the body request")
	if (questionsMissing) return

	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	if (game.questions) {
		res.status(303).send("Questions already added in the game")
		return
	}

	game.addQuestions(questions)
	res.status(200).send({ game })
})

router.post("/:gameCode/start", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { users } = game
	if (users.length === 0) {
		res.status(428).send("Game cannot be started due to lack of users")
		return
	}

	const { isParamMissing: questionsMissing } = getRequestParam(game.questions, res, "No questions added. Game cannot start", 500)
	if (questionsMissing) return

	game.startGame();
	res.status(200).send({ game })
})

router.post("/:gameCode/next/question/start", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const currentQuestionInProgress = game.status.counterActive
	if (currentQuestionInProgress) {
		res.send("Current question is still in progress")
		return
	}

	game.startQuestionCounter()

	res.status(200).send({ gameStatus: game.status, isGameOver: game.gameOver })
})

router.post("/remove/all", (_req, res) => {
	GAMES = [];

	res.status(200).send({ GAMES })
})

export default router