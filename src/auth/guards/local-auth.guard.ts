import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { User, UserDocument } from 'src/users/schemas/user.schema';

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

@Injectable()
export class SellerGuard implements CanActivate {
  /**
   * 세션에 유저정보를 확인하여 현재 세션에 저장된 유저정보가 Seller계정인지 확인
   */
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const user = request?.session?.passport?.user;

    return this.isSellerUser(user);
  }

  isSellerUser(user: UserDocument): boolean {
    return user?.isSeller;
  }
}
