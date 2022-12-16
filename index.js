import express from "express"
import { Game } from "./controllers/game.js"
import { User } from "./controllers/user.js"
import { LOCAL_PORT } from "./globals.js"
import { answerCurrentQuestion } from "./services/answerCurrentQuestion.js"
import { getGame } from "./services/getGame.js"
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
	const { param: questions, isParamMissing: questionsMissing } = getRequestParam(req.body.questions, res, "Questions not sent in the body request")
	if (questionsMissing) return

	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	game.addQuestions(questions)
	res.status(200).send({ game })
})

app.post("/game/:gameCode/start", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { isParamMissing: questionsMissing } = getRequestParam(game.questions, res, "No questions added. Game cannot start", 500)
	if (questionsMissing) return

	game.startGame();
	res.status(200).send({ game })
})

app.post("/game/:gameId/next/question/start", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	game.startQuestionCounter()

	res.status(200).send({ gameStatus: game.status, isGameOver: game.gameOver })
})



// USER POST endpoints
app.post("/user/:gameCode/join", (req, res) => {
	const { param: nickname, isParamMissing: isNicknameMissing } = getRequestParam(req.body.nickname, res, "Nickname not sent in the body request")
	if (isNicknameMissing) return

	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const user = new User(nickname, gameCode)

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	game.addUser(user)
	const gameQuestions = game.questions
	const gameUsers = game.users.filter(user => user.nickname != nickname)

	res.status(200).send({ gameQuestions, gameUsers })
})

app.post("/user/:userNickname/answer/:gameCode", (req, res) => {
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

	const user = game.users.find(user => user.nickname == nickname)
	if (!user) {
		res.status(404).send(`User ${nickname} Not Found in game ${gameCode}`)
		return
	}

	const answeredQuestion = answerCurrentQuestion({game, nickname, user, answer})

	res.status(200).send({ answeredQuestion })
})



// GAME Get endpoints
app.get("/game/:gameCode", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	res.status(200).send({ game })
})

app.get("/game/:gameCode/users", (req, res) => {
	const { param: gameCode, isParamMissing: isGameCodeMissing } = getRequestParam(req.params.gameCode, res, "No game code Provided")
	if (isGameCodeMissing) return

	const { game, gameNotFound, gameStatus, gameMessage } = getGame(GAMES, gameCode)
	if (gameNotFound) {
		res.status(gameStatus).send(gameMessage)
		return
	}

	const { users } = game

	res.status(200).send({ users })
})

app.get("/game/:gameCode/current/question/resolved", (req, res) => {
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

app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})