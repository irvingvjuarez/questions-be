# Endpoints already created

## Game related POST endpoints
- /game/create: Return the game code
- /game/:gameId/delete: Delete the current game room and the respective users
- /game/:gameId/questions: Send all the json object full of all the questions and the respective right answer
- /game/:gameId/start: Starts the game toggling the started boolean property to true
- /game/:gameId/next/question/start: Starts the next question counter and returns game status along with boolean indicating if the game is over (this happens in case there are no more questions available)
## User related POST endpoints
- /user/:gameId/join: Allows the user to join to the game, but in the body is required the nickname. Returns all the questions
- /user/:userId/answer/:gameId: Send in the body info related to the question id and the respective answer
## Game related GET endpoints
- /game/:gameId: Returns the game requested
- /game/:gameId/users: Returns the list with all the users joined into the game
- /game/:gameId/current/question/resolved: Returns a boolean indicating if the question was answered by all the game members
- /game/:gameId/previousQuestionResults: Returns the users' who answered the question
- /game/:gameId/current/score: Returns the result of the game as a whole, listing the first, second and third place
# User related GET endpoints
- /user/:gameId/getUsers: Returns all the users joining the game room and a boolean indicating if the game has already started. It was done in the '/game/:gameCode/users' endpoint
- /user/:gameId/current/question/status: Returns a boolean indicating if the time of an specific question is over and the right answer to the question