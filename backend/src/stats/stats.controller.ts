import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import { StatsResponseDto } from './stats.dto';
import { StatsService } from './stats.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('stats')
@ApiTags('Stats')
@UseGuards(JwtGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  async getStats(@Request() req): Promise<StatsResponseDto> {
    const isAdmin = req.user?.role === Role.Admin;
    return await this.statsService.getStats(isAdmin);
  }
}
