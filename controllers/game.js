import { TIME_TO_ANSWER } from "../globals";

export class Game {
	constructor () {
		this.gameCode = Math.floor(Math.random() * 10000)
		this.started = false;
		this.gameOver = false;
		this.users = []
		this.gameStatus = {
			currentQuestion: null,
			counterActive: true
		}
	}

	getCode () {
		return this.gameCode;
	}

	addQuestions (questions) {
		this.questions = [...questions]
	}

	startGame () {
		this.started = true

		this.startQuestionCounter()
	}

	startQuestionCounter() {
		this.gameStatus.currentQuestion = this.questions.splice(0, 1);

		if (!this.gameStatus.currentQuestion) {
			this.gameOver()
		} else {
			setTimeout(() => {
				this.finishCurrentQuestion()
			}, TIME_TO_ANSWER)
		}
	}

	finishCurrentQuestion () {
		this.gameStatus.counterActive = false;
	}

	gameOver () {
		this.gameOver = true;
	}

	addUser (user) {
		this.users.push(user)
	}

	answerCurrentQuestion (userNickname) {
		this.gameStatus.currentQuestion.answeredBy.push(userNickname)
		const answersLength = this.gameStatus.currentQuestion.answeredBy.length

		if (answersLength === this.users.length) {
			this.gameStatus.currentQuestion.resolved = true
		}

		return this.gameStatus.currentQuestion
	}
}