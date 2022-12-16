export class Game {
	constructor () {
		this.gameCode = Math.floor(Math.random() * 10000)
		this.started = false;
		this.users = []
	}

	getCode () {
		return this.gameCode;
	}

	addQuestions (questions) {
		this.questions = [...questions]
	}

	toggleStart () {
		this.started = !this.started
	}

	addUser (user) {
		this.users.push(user)
	}

	answerQuestion (questionId, userNickname) {
		const question = this.questions.find(question => question.id == questionId)
		question.answeredBy.push(userNickname)

		if (question.answeredBy.length === this.users.length) {
			question.resolved = true
		}

		return question
	}
}