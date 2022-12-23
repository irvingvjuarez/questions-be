# Schemas
This file is related about the data schemas about how the backend is accepting the data.

Only the endpoints added in this file require body in the POST request.

## Add questions
In the endpoint `/game/:gameCode/questions`, the frontend should send in the body the following schema

```
{
	"questions": [
		{
			"id": "0",
			"question": "What's the capital of France",
			"answers": [
				{
					"id": "00",
					"content": "Paris",
					"color": "#985EFE",
					"shape": "circle"
				}
			],
			"correctAnswer": "00",
			"resolved": false,
			"answeredBy": []
		}
	]
}
```

## User joins
In the endpoint `/user/:gameCode/join`, the frontend should look like this:

```
{
	"nickname": "Bellakat"
}
```

## User answers
In the endpoint `/user/:userNickname/answer/:gameCode` the body should include the answer option ID

```
{
	"answer": {
		"answerId": "00"
	}
}
```