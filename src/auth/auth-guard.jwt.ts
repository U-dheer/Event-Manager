import { AuthGuard } from '@nestjs/passport';

export class AuthGurdJwt extends AuthGuard('jwt') {}
