import express from "express"
import { User } from "../models/users.js"
import bcrypt from "bcrypt"

const usersRouter = express.Router()

usersRouter
    .post("/", async (req, res, next) => {
        try {
            const password = await bcrypt.hash(req.body.password, 10)
            const newUser = await User.create({
                ...req.body,
                password,
            })
            res.status(201).json(newUser)
        } catch (err) {
            next(err)
        }
    })
    //AUTENTICAZIONE Authentication
    .post("/session", async (req, res) => {
        //come mai post? scrivere su appunti
        //servirà il token
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        //qui abbiamo bisogno di restituire un Bearer Token al nostro utente
        //in modo che possa poi usarlo per fare richieste autenticate
        //il token ci deve dire chi è l'utente
        res.status(200).json({ message: "Logged in!" })
    })
    .get("/", async (req, res) => {
        const users = await User.find({})
        res.status(200).json(users)
    })
    .get("/:id", async (req, res, next) => {
        try {
            const { id } = req.params //rappresenta l'ultima parte
            const user = await User.findById(id)

            if (!user) {
                return res.status(404).send() //se l'id è consono ma non esiste nel database: 404
            }

            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    })
    .put("/:id", async (req, res, next) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            )
            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    })
    .delete("/:id", async (req, res, next) => {
        try {
            const deletedDocument = await User.findByIdAndDelete(req.params.id)

            if (!deletedDocument) {
                res.status(404).send()
            } else {
                res.status(204).send()
            }
        } catch (error) {
            next(error)
        }
    })

export default usersRouter
