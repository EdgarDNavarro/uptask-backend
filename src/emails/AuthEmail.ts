import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {

    static sendConfirmationEmail = async (user : IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'uptask - Confirma tu cuenta',
            text: 'Uptask - confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en Uptask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
                <p>E ingresa el codigo: <b>${user.token}</b> </p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('mensaje enviado', info.messageId);
        
    }

    static sendPasswordResetToken = async (user : IEmail) => {
        const info = await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'uptask - Reestablece tu password',
            text: 'Uptask - Reestablece tu password',
            html: `
                <p>Hola: ${user.name}, has solicitado</p>
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer password</a>
                <p>E ingresa el codigo: <b>${user.token}</b> </p>
                <p>Este token expira en 10 minutos</p>
            `
        })

        console.log('mensaje enviado', info.messageId);
        
    }
}