import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  /**
   * 세션에 유저정보를 확인하여 인증상태를 확인
   */
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    return request?.session?.passport?.user;
  }
}
