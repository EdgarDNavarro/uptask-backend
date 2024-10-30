import type { Request, Response } from "express"
import User from "../models/User"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        try {
            const user = await User.findOne({email}).select('id email name')
            if(!user){
                const error = new Error("Usuario no encontrado")
                res.status(404).json({error: error.message})
            }
            res.json(user)
        } catch (error) {
            
        }
    }

    static addMemeberById = async (req: Request, res: Response) => {
        const { id } = req.body

        try {
            console.log(id);
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
            console.log(error);
        }
    }
}