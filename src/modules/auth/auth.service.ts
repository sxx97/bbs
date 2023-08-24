import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entity/user.entity';
import { TokenResponse } from './auth.interface';
import { TokenService } from '../token/token.service';
//import Piscina from 'piscina';
const Piscina = require('piscina');
@Injectable()
export class AuthService {
  private piscina: any;
  constructor(
    private tokenService: TokenService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    this.piscina = new Piscina({
      filename: join(__dirname, '../../common/bcryptThreads.js'),
      maxThreads: 4,
      idleTimeout: 300000,
      minThreads: 2,
    });
    this.piscina.on('completed', (result, task) => {
      console.log(`Task completed: ${result}`, task);
    });
  }

  async generateToken(user: User) {
    const payload = { username: user.account, userId: user.id };
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

    const findUser = await this.usersRepository.findOne({
      where: {
        account,
        isDelete: 0,
      },
      select: ['password'],
    });
    if (findUser) {
      const isMatch = await this.piscina.run({
        event: 'compare',
        password,
        hash: findUser.password,
      });
      //      const isMatch = await bcrypt.compare(password, findUser.password);
      if (isMatch) {
        response.accessToken = await this.generateToken(findUser);
      }
    } else {
      const user = new User();
      user.account = account;
      user.passwordSalt = this.getRandomInt(1, 15);
      try {
        user.password = await this.piscina.run({
          event: 'hash',
          password,
          salt: user.passwordSalt,
        });
        //        user.password = await bcrypt.hash(password, user.passwordSalt);
      } catch (err) {
        console.log(err, '加密错误');
      }
      const newUser = await this.usersRepository.save(user);
      response.accessToken = await this.generateToken(newUser);
    }
    return response;
  }
}
