import ApiError from '../exceptions/ApiError'
import { IUserData } from '../interfaces/IUserData'
import prisma from '../prisma'
import bcrypt from 'bcrypt'
import mailService from './mailService'
import activationService from './activationService'
import tokenService from './tokenService'
import UserDto from '../dtos/UserDtos'
import { User } from '@prisma/client'

class UserService {
	async registration (email: string, password: string): Promise<IUserData> {
		const candidate = await prisma.user.findUnique({ where: { email: email } })
		if (candidate) {
			throw ApiError.BadRequest('Пользователь с таким почтовым адресом уже зарегестрирован')
		}
		const hashPassword = await bcrypt.hash(password, 5)
		const user = await prisma.user.create({ data: { email: email, password: hashPassword } })
		const activation = await activationService.saveActivation(user.id)
		const actiovationLink = `${ process.env.API_DOMAIN }/user/activation/${ activation.link }`
		await mailService.sendActivationMail(email, actiovationLink)
		const userDto = new UserDto(user, activation)
		const tokens = await tokenService.generateTokens(userDto)
		await tokenService.saveRefreshToken(user.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async login (email: string, password: string): Promise<IUserData> {
		const user = await prisma.user.findUnique({ where: { email: email } })
		if (!user) {
			throw ApiError.BadRequest('Пользователь с таким почтовым адресом ещё не зарегестрирован')
		}
		const isEqual = await bcrypt.compare(password, user.password)
		if (!isEqual) {
			throw ApiError.BadRequest('Неверный пароль')
		}
		const activation = await activationService.findActivationById(user.id)
		const userDto = new UserDto(user, activation)
		const tokens = await tokenService.generateTokens(userDto)
		await tokenService.saveRefreshToken(user.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async logout (refreshToken: string): Promise<void> {
		if (!refreshToken) {
			throw ApiError.Anauthorized()
		}
		const token = await tokenService.findRefreshToken(refreshToken)
		if (!token) {
			throw ApiError.Anauthorized()
		}
		await tokenService.removeRefreshToken(refreshToken)
	}

	async refresh (refreshToken: string): Promise<IUserData> {
		if (!refreshToken) {
			throw ApiError.Anauthorized()
		}
		const payload = await tokenService.validateRefreshToken(refreshToken)
		if (!payload) {
			throw ApiError.Anauthorized()
		}
		const token = await tokenService.findRefreshToken(refreshToken)
		if (!token) {
			throw ApiError.Anauthorized()
		}
		const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.id } })
		const activation = await prisma.activation.findUniqueOrThrow({ where: { userId: user.id } })
		const userDto = new UserDto(user, activation)
		const tokens = await tokenService.generateTokens({ ...userDto })
		await tokenService.saveRefreshToken(user.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async activate (link: string): Promise<IUserData> {
		let activation = await activationService.findActivationByLink(link)
		if (!activation) {
			throw ApiError.BadRequest('Недействительная ссылка активации аккаунта')
		}
		activation = await activationService.activate(activation.userId)
		const user = await prisma.user.findUniqueOrThrow({ where: { id: activation.userId } })
		const userDto = new UserDto(user, activation)
		const tokens = await tokenService.generateTokens(userDto)
		await tokenService.saveRefreshToken(user.id, tokens.refreshToken)
		return { ...tokens, user: userDto }
	}

	async getUsers (): Promise<User[]> {
		const users = await prisma.user.findMany()
		return users
	}
}

export default new UserService