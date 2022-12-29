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
		this.totalScore = {}
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

		this.users.forEach(user => this.totalScore[user.nickname] = 0)

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

	getScores () {
		let sortedScore = []

		if (this.answeredQuestions.length === 0) {
			const response = this.users.map(user => ({
				...user,
				score: 0
			}))

			return {
				totalScore: response,
				sortedScore: response
			}
		}

		this.answeredQuestions.forEach(question => {
			question.answeredBy.forEach(({userScore, userNickname}) => {
				this.totalScore[userNickname] += userScore
			})
		})

		for (let key of Object.keys(this.totalScore)) {
			const userScore = { user: key, score: this.totalScore[key] }
			sortedScore.push(userScore)
		}

		sortedScore = sortedScore.sort((a, b) => {
			let order = 0;
			if (a.score < b.score) order = 1
			if (a.score > b.score) order = -1

			return order
		})

		return { totalScore: this.totalScore, sortedScore }
	}
}