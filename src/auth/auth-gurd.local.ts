import { AuthGuard } from '@nestjs/passport';

export class AuthGurdLocal extends AuthGuard('local') {}
