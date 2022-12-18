import { TIME_TO_ANSWER } from "../globals.js";

export class Game {
	constructor () {
		this.gameCode = Math.floor(Math.random() * 10000)
		this.started = false;
		this.gameOver = false;
		this.users = []
		this.status = {
			currentQuestion: null,
			counterActive: null
		}
		this.answeredQuestions = []
	}

	getCode () {
		return this.gameCode;
	}

	addQuestions (questions) {
		this.questions = [...questions]
	}

	startGame () {
		this.started = true
		this.maxUserScore = this.users.length + 1

		this.startQuestionCounter()
	}

	startQuestionCounter() {
		this.currentScore = this.maxUserScore
		const splicedQuestion = this.questions.splice(0, 1)
		this.status.currentQuestion = splicedQuestion[0];

		if (!this.status.currentQuestion) {
			this.gameOver = true
		} else {
			this.status.counterActive = true
			setTimeout(() => {
				this.finishCurrentQuestion()
			}, TIME_TO_ANSWER)
		}
	}

	finishCurrentQuestion () {
		this.status.counterActive = false;
		this.status.currentQuestion.resolved = true

		this.answeredQuestions.push(this.status.currentQuestion)
		this.status.currentQuestion = null

	}

	gameOver () {
		this.gameOver = true;
	}

	addUser (user) {
		this.users.push(user)
	}

	answerCurrentQuestion (answerInfo) {
		const { nickname: userNickname, isUserCorrect } = answerInfo
		this.currentScore -= 1

		const userScore = isUserCorrect ? this.currentScore : 0;
		const answer = { userScore, userNickname }
		this.status.currentQuestion.answeredBy.push(answer)

		const answersLength = this.status.currentQuestion.answeredBy.length

		if (answersLength === this.users.length) {
			this.status.currentQuestion.resolved = true
		}

		return this.status.currentQuestion
	}
}