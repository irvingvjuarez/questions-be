export class User {
	constructor (nickname, gameCode) {
		this.nickname = nickname
		this.gameHistorial = {
			gameCode,
			answers: []
		}
	}

	answerCurrentQuestion (answerInfo) {
		const { currentQuestionId, isUserCorrect } = answerInfo

		this.gameHistorial.answers.push({ currentQuestionId, isUserCorrect })
	}
}