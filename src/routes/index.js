import gameRouter from "./game.route.js"
import userRouter from "./user.route.js"

export function routing(app) {
	app.use("/game", gameRouter)
	app.use("/user", userRouter)
}