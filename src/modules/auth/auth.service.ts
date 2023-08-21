import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { TokenResponse } from './auth.interface';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async generateToken(user: User) {
    const payload = { username: user.account, sub: user.id };
    return this.tokenService.signJwt(payload);
  }

  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is exclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async login(account: string, password: string): Promise<TokenResponse> {
    const response: TokenResponse = { accessToken: '', refreshToken: '' };

    const findUser = await this.usersRepository.findOneBy({
      account,
    });
    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (isMatch) {
        response.accessToken = await this.generateToken(findUser);
      }
    } else {
      const user = new User();
      user.account = account;
      user.passwordSalt = this.getRandomInt(1, 15);
      try {
        user.password = await bcrypt.hash(password, user.passwordSalt);
      } catch (err) {
        console.log(err, '加密错误');
      }
      const newUser = await this.usersRepository.save(user);
      response.accessToken = await this.generateToken(newUser);
    }
    return response;
  }
}
