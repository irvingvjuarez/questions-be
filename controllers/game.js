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
}