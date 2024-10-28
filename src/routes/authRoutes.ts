import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account', 
    body('name').notEmpty().withMessage("El nombre no puede ir vacio"),
    body('password').isLength({min: 8}).withMessage("El password es muy corto, minimo 8 caracteres"),
    body('password_confirmation').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    body('email').isEmail().withMessage("Email no valido"),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body("token").notEmpty().withMessage("El token no puede ir vacio"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().withMessage("Email no valido"),
    body('password').notEmpty().withMessage("El password es no puede estar vacio"),
    handleInputErrors,
    AuthController.login
)

export default router