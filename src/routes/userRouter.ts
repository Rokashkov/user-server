import express from 'express'
import userController from '../controllers/userController'
import { body } from 'express-validator'
import authorizationMiddleware from '../middlewares/authorizationMiddleware'

const userRouter = express.Router()

userRouter.post(
	'/registration',
	body('email').isEmail(),
	body('password').isLength({ min: 5, max: 20 }), 
	userController.registration
)
userRouter.post('/login', userController.login)
userRouter.get('/logout', userController.logout)
userRouter.get('/refresh', userController.refresh)
userRouter.get('/activation/:link', userController.activate)
userRouter.get('/', authorizationMiddleware, userController.getUsers)

export default userRouter