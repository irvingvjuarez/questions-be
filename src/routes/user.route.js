import express from "express"
import { User } from "../controllers/user.js"
import { GAMES } from "../../globals.js"
import { answerCurrentQuestion } from "../services/answerCurrentQuestion.js"
import { getGame } from "../services/getGame.js"
import { getRequestParam } from "../services/getRequestParam.js"

const router = express.Router()

// USER POST endpoints
router.post("/:gameCode/join", (req, res) => {
	const { param: nickname, isParamMissing: isNicknameMissing } = getRequestParam(req.body.nickname, res, "Nickname not sent in the body request")
	if (isNicknameMissing) return

	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const userIndex = game.users.findIndex(user => user.nickname == nickname);

	if (userIndex >= 0) {
		res.status(303).send(`User with nickname ${nickname} already exists`)
		return
	}

	const user = new User(nickname, gameCode)

	game.addUser(user)
	const gameQuestions = game.questions
	const gameUsers = game.users.map(user => {
		if (user.nickname == nickname) {
			return {
				...user,
				nickname: `${user.nickname} (You)`
			}
		}

		return user
	})

	res.status(200).send({ gameQuestions, gameUsers, gameCode })
})

router.post("/:userNickname/answer/:gameCode", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { param: nickname, isParamMissing: nicknameMissing } = getRequestParam(req.params.userNickname, res, "No nickname Provided")
	if (nicknameMissing) return

	const { param: answer, isParamMissing: answerMissing } = getRequestParam(req.body.answer, res, "Answer not sent in the body request")
	if (answerMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	if (!game.status.counterActive) {
		res.status(403).send("Answering is not available anymore.")
		return
	}

	const user = game.users.find(user => user.nickname == nickname)
	if (!user) {
		res.status(404).send(`User ${nickname} Not Found in game ${gameCode}`)
		return
	}

	const userAlreadyAnswered = game.status.currentQuestion.answeredBy.find(answer => answer.userNickname == nickname)
	if (userAlreadyAnswered) {
		res.status(403).send(`User ${nickname} cannot answer the same question twice.`)
		return
	}

	const answeredQuestion = answerCurrentQuestion({game, nickname, user, answer})

	res.status(200).send({ answeredQuestion })
})

// USER GET endpoints
router.get("/:gameCode/current/question/status", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { status, gameOver: isGameOver } = game
	res.status(200).send({ status, isGameOver })
})

export default router