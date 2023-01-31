import createApp from "../index.js"
import request from "supertest"

const initialQuestions = {
	"questions": [
		{
			"id": "0",
			"question": "First question",
			"answers": [
				{
					"id": "00",
					"content": "A",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "01",
					"content": "B",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "02",
					"content": "C",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "03",
					"content": "D",
					"color": "#985EFE",
					"shape": "circle"
				}
			],
			"correctAnswer": "00",
			"resolved": false,
			"answeredBy": []
		},
		{
			"id": "01",
			"question": "Second question",
			"answers": [
				{
					"id": "00",
					"content": "A",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "01",
					"content": "B",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "02",
					"content": "C",
					"color": "#985EFE",
					"shape": "circle"
				},
				{
					"id": "03",
					"content": "D",
					"color": "#985EFE",
					"shape": "circle"
				}
			],
			"correctAnswer": "03",
			"resolved": false,
			"answeredBy": []
		}
	]
}

describe("Testing app as a whole", () => {
	let app, server
	const testingPort = 3001

	beforeAll(() => {
		app = createApp()
		server = app.listen(testingPort, () => console.log(`App listening at port: ${testingPort}`))
	})

	afterAll(async () => {
		await server.close()
	})

	test("Initializing our app", () => {
		return request(app)
			.post("/game/create")
			.send(initialQuestions)
			.set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
			.expect(200)
			.then(res => {
				expect(res.gameCode).toBeInstanceOf(Number)
			})
	})
})