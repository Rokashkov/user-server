import UserDto from '../dtos/UserDtos'

export interface IUserData {
	accessToken: string
	refreshToken: string
	user: UserDto
}