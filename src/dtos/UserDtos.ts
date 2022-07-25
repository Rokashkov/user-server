import { Activation, User } from '@prisma/client'

class UserDto {
	id: number
	email: string
	isActivated: boolean
	
	constructor(user: User, activation: Activation) {
		this.id = user.id
		this.email = user.email
		this.isActivated = activation.isActivated
	}
}

export default UserDto