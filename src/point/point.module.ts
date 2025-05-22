import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PointService],
  controllers: [PointController],
})
export class PointModule {}
