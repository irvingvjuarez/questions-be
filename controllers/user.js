export class User {
	constructor (nickname, gameCode) {
		this.nickname = nickname
		this.gameHistorial = {
			gameCode,
			answers: []
		}
	}

	answerCurrentQuestion (answer) {
		this.gameHistorial.answers.push(answer)
	}
}