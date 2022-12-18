export const answerCurrentQuestion = ({game, nickname, user, answer}) => {
	const optionChosen = answer.answerId
	const currentQuestionId = game.status.currentQuestion.id
	const correctOption = game.status.currentQuestion.correctAnswer
	const isUserCorrect = optionChosen == correctOption

	const actualAnswer = {
		nickname, currentQuestionId, isUserCorrect
	}

	const answeredQuestion = game.answerCurrentQuestion(actualAnswer)
	user.answerCurrentQuestion(actualAnswer)

	// TODO: prove what happens when the users answers wrongly
	// console.log(game.status.currentQuestion.answeredBy)
	// console.log(user.gameHistorial.answers)

	return answeredQuestion
}