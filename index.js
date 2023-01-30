import express from "express"
import cors from "cors"
import { GAMES, LOCAL_PORT } from "./globals.js"
import { routing } from "./routes/index.js"

const app = express()

app.use(express.json())
app.use(cors())
routing(app)

// GAME GET endpoints
app.get("/games", (_req, res) => {
	res.status(200).send({ games: GAMES })
})

// STARTING server
app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})