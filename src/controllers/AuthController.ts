import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            const userExists = await User.findOne({email})
            if(userExists) {
                const error = new Error('El usuario ya esta registrado')
                res.status(409).json({error: error.message})
                return
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            res.send("Cuenta creada, revisa tu email para confirmar")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({token})
            if(!tokenExists) {
                const error = new Error('Token no valido')
                res.status(404).json({error: error.message})
                return
            }

            const user = await User.findById(tokenExists.user)
            if(!user) {
                const error = new Error('User no existe')
                res.status(404).json({error: error.message})
                return
            }
            user.confirmed = true

            await Promise.allSettled([user.save(),tokenExists.deleteOne()])
            res.send("Cuenta confirmada")
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body
            const user = await User.findOne({email})
            if(!user) {
                const error = new Error('Email o Password incorrrecto')
                res.status(404).json({error: error.message})
                return
            }
            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('Hemos enviado un e-amil de confirmacion')
                res.status(401).json({error: error.message})
                return
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error('Email o Password incorrrecto')
                res.status(401).json({error: error.message})
                return
            }

            res.json({password, email})
        } catch (error) {
            res.status(500).json({error: "Hubo un error"})
        }
    }
}