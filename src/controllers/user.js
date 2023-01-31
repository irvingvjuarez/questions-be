export class User {
	constructor (nickname, gameCode) {
		this.nickname = nickname
		this.gameHistorial = {
			gameCode,
			answers: []
		}
		this.score = 0
	}

	answerCurrentQuestion (answerInfo, userScore) {
		const { currentQuestionId, isUserCorrect } = answerInfo

		this.score = userScore
		this.gameHistorial.answers.push({ currentQuestionId, isUserCorrect })
	}
}