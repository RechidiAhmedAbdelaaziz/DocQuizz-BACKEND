import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionRequestService, SubscriptionOfferService, SubscriptionService } from './subscription.service';
import { SubscriptionController, SubscriptionRequestController, SubscriptionOfferController } from './subscription.controller';
import { DatabaseModule } from '@app/common';
import { SubscriptionRequest, Subscription, SubscriptionOffer } from '@app/common/models/subscription.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { model: Subscription },
      { model: SubscriptionRequest },
      { model: SubscriptionOffer }

    ]),
    forwardRef(() => UserModule),
  ],
  controllers: [SubscriptionController, SubscriptionRequestController, SubscriptionOfferController],
  providers: [SubscriptionRequestService, SubscriptionOfferService, SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
