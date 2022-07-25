import { Token } from '@prisma/client'
import jwt from 'jsonwebtoken'
import UserDto from '../dtos/UserDtos'
import { IPayload } from '../interfaces/IPayload'
import { ITokens } from '../interfaces/ITokens'
import prisma from '../prisma'

class TokenService {
	async generateTokens (userDto: UserDto): Promise<ITokens> {
		const accessToken = jwt.sign({ ...userDto }, process.env.JWT_ACCESS_SECRET, { expiresIn: '30s' })
		const refreshToken = jwt.sign({ ...userDto }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
		return { accessToken, refreshToken }
	}

	async saveRefreshToken (userId: number, refreshToken: string): Promise<Token> {
		let token = await prisma.token.findUnique({ where: { userId: userId } })
		if (token) {
			token = await prisma.token.update({ where: { userId: userId }, data: { refreshToken: refreshToken } })
			return token
		}
		token = await prisma.token.create({ data: { userId: userId, refreshToken: refreshToken } })
		return token
	}

	async removeRefreshToken (refreshToken: string): Promise<void> {
		await prisma.token.delete({ where: {refreshToken: refreshToken} })
	}

	async findRefreshToken (refreshToken: string): Promise<Token | null> {
		const token = await prisma.token.findFirst({ where: { refreshToken: refreshToken } })
		return token
	}

	async validateAccessToken (accessToken: string): Promise<IPayload | null> {
		try {
			const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
			return payload as IPayload
		} catch (err) {
			return null
		}
	}

	async validateRefreshToken (refreshToken: string): Promise<IPayload | null> {
		try {
			const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
			return payload as IPayload
		} catch (err) {
			return null
		}
	}
}

export default new TokenService