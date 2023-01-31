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
		if(this.status.counterActive) {
			this.status.counterActive = false;
			this.status.currentQuestion.resolved = true

			this.answeredQuestions.push(this.status.currentQuestion)
			this.status.currentQuestion = null
		}
	}

	gameOver () {
		this.gameOver = true;
	}

	addUser (user) {
		this.users.push(user)
	}

	answerCurrentQuestion (answerInfo) {
		const { nickname: userNickname, isUserCorrect, currentUserScore } = answerInfo

		if (isUserCorrect) {
			this.currentScore -= 1
		}

		const userScore = isUserCorrect ? (currentUserScore + this.currentScore) : currentUserScore;
		const answer = { userScore, userNickname }
		const answersLength = this.status.currentQuestion.answeredBy.push(answer)

		if (answersLength === this.users.length) {
			setTimeout(() => this.finishCurrentQuestion(), 1000)
		}

		return {
			currentQuestion: this.status.currentQuestion,
			userScore
		}
	}

	getScores () {
		const totalScore = this.users.map(({nickname, score}) => ({
			nickname,
			score
		}))

		const sortedScore = totalScore.sort((a, b) => {
			let order = 0;
			if (a.score < b.score) order = 1
			if (a.score > b.score) order = -1

			return order
		})

		return { totalScore, sortedScore }
	}
}