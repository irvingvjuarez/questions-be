import express from "express"
import { Game } from "../controllers/game.js"
import { AUTO_DESTROYING_TIMESPAN, GAMES } from "../../globals.js"
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

// GET SECTION
router.get("/:gameCode", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	res.status(200).send({ game })
})

router.get("/:gameCode/users", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { users, started: gameStarted } = game

	res.status(200).send({ users, gameStarted, status: game.status })
})

router.get("/:gameCode/users/:nickname", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { param: nickname, isParamMissing: isNicknameMissing } = getRequestParam(req.params.nickname, res, "User nickname not found")
	if (isNicknameMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const userIndex = game.users.findIndex(user => user.nickname == nickname)
	if (userIndex < 0) {
		res.status(404).send(`User ${nickname} not found in the game`)
		return
	}

	const { started: gameStarted } = game
	const users = [...game.users]
	const status = game.status

	const user = users.splice(userIndex, 1)[0];

	users.unshift({
		...user,
		nickname: `${user.nickname} (You)`
	})

	res.status(200).send({ users, gameStarted, status })
})

router.get("/:gameCode/current/question/resolved", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const isQuestionResolved = !game.status.counterActive
	const isGameOver = game.gameOver

	res.status(200).send({ isQuestionResolved, isGameOver })
})

router.get("/:gameCode/previousQuestionResults", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const answeredQuestionsSize = game.answeredQuestions.length

	try {
		const previousQuestionResults = game.answeredQuestions[answeredQuestionsSize - 1].answeredBy
		res.status(200).send({ previousQuestionResults })
	} catch (err) {
		res.status(404).send("Previous question not found. Probably there is no available yet.")
	}
})

router.get("/:gameCode/current/score", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { totalScore, sortedScore } = game.getScores()
	res.status(200).send({ totalScore, sortedScore })
})

router.get("/:gameCode/current/question/full/status", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { status, gameOver: isGameOver, started } = game

	if (!started) {
		res.status(401).send("The game has not started yet. Request unauthorized.");
		return
	}

	const { totalScore, sortedScore } = game.getScores()
	res.status(200).send({ status, isGameOver, sortedScore })
})

export default router