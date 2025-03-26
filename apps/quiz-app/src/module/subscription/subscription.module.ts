import { Module } from '@nestjs/common';
import { SubscriptionRequestService, SubscriptionOfferService, SubscriptionService } from './subscription.service';
import { SubscriptionController, SubscriptionRequestController, SubscriptionOfferController } from './subscription.controller';
import { DatabaseModule } from '@app/common';
import { Subscription } from 'rxjs';
import { SubscriptionRequest } from '@app/common/models/subscription.model';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { model: Subscription },
      { model: SubscriptionRequest }
    ])
  ],
  controllers: [SubscriptionController, SubscriptionRequestController, SubscriptionOfferController],
  providers: [SubscriptionRequestService, SubscriptionOfferService, SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule { }
