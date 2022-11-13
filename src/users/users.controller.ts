import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  AuthenticatedGuard,
  UserNotSellerGuard,
} from '../auth/guards/local-auth.guard';
import { User } from '../auth/decorators/auth.decorator';
import { EnrollSellerDto } from './dto/enroll-seller.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * [PATCH] /api/users/seller
   * seller 로 등록
   * 아직 셀러로 등록하지 않은 로그인된 유저만 사용가능
   */
  @UseGuards(UserNotSellerGuard)
  @Patch('seller')
  async enrollSeller(@User() user, @Body() enrollSellerDto: EnrollSellerDto) {
    this.usersService.updateUserInfo(user?._id, {
      ...enrollSellerDto,
      isSeller: true,
    });
  }

  /**
   * [GET] /api/users/profile
   * 로그인한 유저정보 조회
   */
  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  async getUserInfo(@User() user) {
    return this.usersService.findUserById(user?._id);
  }
}
