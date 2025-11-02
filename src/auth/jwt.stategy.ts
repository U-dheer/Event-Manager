import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // Prefer the configured AUTH_JWT_SECRET, but fall back to the older JWT_SECRET_KEY
    // so the app doesn't break if one of the env names is used.
    const jwtSecret = process.env.AUTH_JWT_SECRET ?? process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      throw new Error(
        'JWT secret is not defined. Set AUTH_JWT_SECRET (or JWT_SECRET_KEY) in the environment',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    return await this.userRepository.findOneBy({ id: payload.sub });
  }
}
