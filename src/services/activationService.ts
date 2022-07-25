import { Activation } from '@prisma/client'
import { v4 } from 'uuid'
import prisma from '../prisma'

class ActivationService {
	async saveActivation (userId: number): Promise<Activation> {
		const link = v4()
		const activation = await prisma.activation.create({ data: { userId: userId, link: link } })
		return activation
	}

	async findActivationById (userId: number): Promise<Activation> {
		const activation = await prisma.activation.findFirstOrThrow({ where: { userId: userId } })
		return activation
	}

	async findActivationByLink (link: string): Promise<Activation | null> {
		const activation = await prisma.activation.findFirst({ where: { link: link } })
		return activation
	}
	
	async activate (userId: number): Promise<Activation> {
		const activation = await prisma.activation.update({ where: { userId: userId }, data: { isActivated: true, link: null } })
		return activation
	}
}

export default new ActivationService