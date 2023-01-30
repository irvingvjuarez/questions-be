import gameRouter from "./game.route.js"

export function routing(app) {
	app.use("/game", gameRouter)
}