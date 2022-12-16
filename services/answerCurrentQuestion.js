export const answerCurrentQuestion = ({game, nickname, user, answer}) => {
	const answeredQuestion = game.answerCurrentQuestion(nickname)
	user.answerCurrentQuestion(answer)

	return answeredQuestion
}