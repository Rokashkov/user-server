import { Request, Response, NextFunction } from 'express'
import ApiError from '../exceptions/ApiError'

const errorMiddleware = async (err: any, req: Request, res: Response, next: NextFunction): Promise<Response> => {
	console.log(err)
	if (err instanceof ApiError) {
		return res.status(err.status).json({ message: err.message, errors: err.errors })
	}
	return res.status(500).json({ message: 'Непредвиденная ошибка' })
}

export default errorMiddleware