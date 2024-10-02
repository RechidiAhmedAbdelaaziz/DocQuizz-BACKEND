import { Module } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { UpdatesController } from './updates.controller';
import { DatabaseModule } from '@app/common';
import { Updates } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Updates }])
  ],
  controllers: [UpdatesController],
  providers: [UpdatesService],
})
export class UpdatesModule { }
