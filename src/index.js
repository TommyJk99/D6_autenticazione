import express from "express"
import usersRouter from "./routes/users.js"
import mongoose from "mongoose"

const app = express()

app.use(express.json())

app.get("/health", (req, res) => {
    res.status(200).json({ message: "ok" })
})

app.use("/users", usersRouter)

const port = process.env.PORT || 3030

mongoose.connect(process.env.MONGO_URL).then(
    app.listen(port, () => {
        console.log("Server is running on port:", port)
    })
)
