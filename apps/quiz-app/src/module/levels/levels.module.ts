import { forwardRef, Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { DatabaseModule } from '@app/common';
import { Level, Course, Domain, Major } from '@app/common/models';
import { UserModule } from '../user/user.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ model: Level }, { model: Major }, { model: Domain }, { model: Course }])
    , forwardRef(() => UserModule),
    SubscriptionModule
  ],
  controllers: [LevelsController],
  providers: [LevelsService],
  exports: [LevelsService],

})
export class LevelsModule { }
