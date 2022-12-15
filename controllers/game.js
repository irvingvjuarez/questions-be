export class Game {
	constructor () {
		this.gameCode = Math.floor(Math.random() * 10000)
	}

	getCode () {
		return this.gameCode;
	}

	addQuestions (questions) {
		this.questions = [...questions]
	}
}