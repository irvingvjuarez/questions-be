import express from "express"
import { LOCAL_PORT } from "./globals.js"

const app = express()

app.listen(LOCAL_PORT, () => {
	console.log(`Listening at http://localhost:${LOCAL_PORT}`)
})