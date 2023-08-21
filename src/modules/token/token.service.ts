import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  signJwt(payload) {
    return this.jwtService.sign(payload);
  }
	
}
