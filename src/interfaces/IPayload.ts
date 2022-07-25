import { JwtPayload } from 'jsonwebtoken'
import UserDto from '../dtos/UserDtos'

export interface IPayload extends JwtPayload, UserDto {
}