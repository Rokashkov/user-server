import { Request, Response, NextFunction } from 'express'
import ApiError from '../exceptions/ApiError'
import tokenService from '../services/tokenService'

const authorizationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader) {
			throw ApiError.Anauthorized()
		}
		const accessToken = authorizationHeader.split(' ')[1]
		if (!accessToken) {
			throw ApiError.Anauthorized()
		}
		const payload = await tokenService.validateAccessToken(accessToken)
		if (!payload) {
			throw ApiError.Anauthorized()
		}
		next()
	} catch (err) {
		next(err)
	}
}

export default authorizationMiddleware