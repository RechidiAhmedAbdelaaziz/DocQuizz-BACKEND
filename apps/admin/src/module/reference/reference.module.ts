import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceController } from './reference.controller';
import { DatabaseModule } from '@app/common';
import { Reference } from '@app/common/models';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Reference }])
  ],
  controllers: [ReferenceController],
  providers: [ReferenceService],
  exports: [ReferenceService]
})
export class ReferenceModule { }
