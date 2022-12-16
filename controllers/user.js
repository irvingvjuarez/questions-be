export class User {
	constructor (nickname, gameCode) {
		this.nickname = nickname
		this.gameHistorial = {
			gameCode,
			answers: []
		}
	}

	answerQuestion (answer) {
		this.gameHistorial.answers.push(answer)
	}
}