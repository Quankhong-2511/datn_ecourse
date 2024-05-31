import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles/roles.decorator';
import { RoleEnum } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { NotificationService } from './notification.service';
import { CommonService } from 'src/utils/services/common.service';
import { FilterNotificationDto } from './dto/filter-notifications.dto';
import { ResponseHelper } from 'src/utils/helpers/response.helper';
import { BaseResponseDto } from 'src/utils/dto/base-response.dto';
import { Recipients } from './entities/recipients.entity';
import { Notifications } from './entities/notifications.entity';
@ApiBearerAuth()
@Roles(RoleEnum.admin, RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Notifications')
@Controller({
  path: 'notifications',
  version: '1',
})
export class NotificationController {
  constructor(
    private notificationsService: NotificationService,
    private commonService: CommonService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async list(@Body() filter: FilterNotificationDto, @Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const list = await this.notificationsService.list(filter, account.id);
    return ResponseHelper.success(list);
  }

  @Get()
  async countNotification(@Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const total = await this.notificationsService.countNotification(account.id);
    return ResponseHelper.success(total);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: number, @Req() request): Promise<BaseResponseDto<Recipients>> {
    const account = this.commonService.getAccountInformationLogin(request);
    const update = await this.notificationsService.updateStatusNotification(id, account.id);
    return update;
  }

  @Get('years')
  async yearsNotification(@Req() request) {
    const account = this.commonService.getAccountInformationLogin(request);
    const listYears = await this.notificationsService.getNotificationYears(account.id);
    return ResponseHelper.success(listYears);
  }

  @Patch('read-all/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateAllStatusToRead(@Param('userId') userId: number) {
    return this.notificationsService.updateAllStatusNotification(userId);
  }
}
