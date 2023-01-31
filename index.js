import express from "express"
import cors from "cors"
import { GAMES, LOCAL_PORT } from "./globals.js"
import { routing } from "./src/routes/index.js"

export function createApp() {
	const app = express()

	app.use(express.json())
	app.use(cors())
	routing(app)

	// GAME GET endpoints
	app.get("/games", (_req, res) => {
		res.status(200).send({ games: GAMES })
	})

	return app
}

const App = createApp()

// STARTING server
App.listen(LOCAL_PORT, () => console.log(`Listening at http://localhost:${LOCAL_PORT}`))

