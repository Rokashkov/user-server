import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import ApiError from '../exceptions/ApiError'
import userService from '../services/userService'

class UserController {
	async registration (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				throw ApiError.BadRequest('Ошибка валидации', errors.array())
			}
			const { email, password } = req.body
			const userData = await userService.registration(email, password)
			res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: false })
			res.json(userData)
		} catch (err) {
			next(err)
		}
	}

	async login (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { email, password } = req.body
			const userData = await userService.login(email, password)
			res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: false })
			res.json(userData) 
		} catch (err) {
			next(err)
		}
	}

	async logout (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies
			await userService.logout(refreshToken)
			res.clearCookie('refreshToken')
			res.sendStatus(200)
		} catch (err) {
			next(err)
		}
	}

	async refresh (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies
			const userData = await userService.refresh(refreshToken)
			res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false } )
			res.json(userData)
		} catch (err) {
			next(err)
		}
	}

	async activate (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { link } = req.params
			const userData = await userService.activate(link)
			req.body = userData
			res.cookie('refreshToken', userData.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, secure: false })
			res.redirect(process.env.CLIENT_DOMAIN)
		} catch (err) {
			next(err)
		}
	}

	async getUsers (req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const users = await userService.getUsers()
			res.json(users)
		} catch (err) {
			next(err)
		}
	}
}

export default new UserController