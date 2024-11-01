import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayload = {
    id: Types.ObjectId
}

export const generateJWT = (payload: UserPayload) => {
    const data = {
        id: payload.id
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}