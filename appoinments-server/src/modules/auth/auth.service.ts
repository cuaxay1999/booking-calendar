import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { validateHash } from '../../utils/auth.util';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  generateToken(userId: number, role: number): Promise<any> {
    return this.jwtService.signAsync({
      id: userId,
      role,
    });
  }

  async login(phone: string, passwordData: string): Promise<any> {
    const user = await this.userService.findOne(phone);

    if (!user || !user.status) {
      return false;
    }

    const isValid = await validateHash(passwordData, user.password);

    if (!isValid) return false;

    const token = await this.generateToken(user.id, user.role);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return {
      access_token: token,
      user: userData,
    };
  }
}
