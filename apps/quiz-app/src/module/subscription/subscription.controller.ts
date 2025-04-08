import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SubscriptionRequestService, SubscriptionOfferService, SubscriptionService } from './subscription.service';
import { PaginationQuery } from '@app/common/utils/pagination';
import { AdminGuard, CurrentUser, HttpAuthGuard, ParseMonogoIdPipe } from '@app/common';
import { Types } from 'mongoose';
import { CreateSubDTO as CreateSubBody } from './dto/create-sub.dto';
import { CreateSubscriptionRequestBody } from './dto/create-request';
import { CreateOfferBody, updateSubscriptionOfferBody } from './dto/create-offer.dto';
import { UserService } from '../user/user.service';
import { StatisticService } from '../statistic/statistic.service';
import { of } from 'rxjs';

@Controller('subscription')

export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly statisticService: StatisticService

  ) { }

  @UseGuards(AdminGuard)
  @Get()
  async getSubscriptions(
    @Query() query: PaginationQuery
  ) {
    const { page, limit } = query;

    return await this.subscriptionService.getSubscriptions(
      {}, {
      limit, page
    }
    );
  }

  @UseGuards(HttpAuthGuard)
  @Get('me')
  async getMySubscriptions(
    @CurrentUser() userId: Types.ObjectId,
  ) {
    const data = await this.subscriptionService.getSubscriptions(
      { user: userId }, {}
    );

    return data
  }

  @UseGuards(AdminGuard)
  @Post()
  async createSubscription(
    @Body() body: CreateSubBody,
  ) {
    const { offerId, email } = body;

    const { _id: userId } = await this.userService.getUserByEmail(email)

    const data = await this.subscriptionService.createSubscription(
      {
        userId,
        offerId
      }
    );

    await this.statisticService.updateStatistic({ newSubscribedUser: 1 })

    return { data }
  }

  @UseGuards(AdminGuard)
  @Delete(':subscriptionId')
  async deleteSubscription(
    @Param('subscriptionId', ParseMonogoIdPipe) subscriptionId: Types.ObjectId,
  ) {
    await this.subscriptionService.cancelSubscription(
      subscriptionId
    );

    await this.statisticService.updateStatistic({ newSubscribedUser: -1 })

    return { message: 'Subscription cancelled successfully' }
  }

}


@Controller('subscription-request')
export class SubscriptionRequestController {
  constructor(private readonly subscriptionRequestService: SubscriptionRequestService,
    private readonly statisticService: StatisticService,

  ) { }

  @UseGuards(AdminGuard)
  @Get()
  async getSubscriptionRequests(
    @Query() query: PaginationQuery
  ) {
    const { page, limit } = query;

    return await this.subscriptionRequestService.getSubscriptionRequests(
      { limit, page }
    );
  }

  @UseGuards(HttpAuthGuard)
  @Delete(':requestId')
  async deleteSubscriptionRequest(
    @Param('requestId', ParseMonogoIdPipe) requestId: Types.ObjectId,
  ) {
    await this.subscriptionRequestService.cancelSubscriptionRequest(
      requestId
    );

    await this.statisticService.updateStatistic({ newSubscribtionRequest: -1 })

    return { message: 'Subscription request cancelled successfully' }
  }

  @UseGuards(HttpAuthGuard)
  @Post()
  async createSubscriptionRequest(
    @CurrentUser() userId: Types.ObjectId,
    @Body() body: CreateSubscriptionRequestBody,
  ) {
    const { offerId, image } = body;

    const data = await this.subscriptionRequestService.createSubscriptionRequest(
      {
        userId,
        offerId,
        image
      }
    );

    await this.statisticService.updateStatistic({ newSubscribtionRequest: 1 })

    return { data }
  }

  @UseGuards(AdminGuard)
  @Patch(':requestId')
  async approveSubscriptionRequest(
    @Param('requestId', ParseMonogoIdPipe) requestId: Types.ObjectId,
  ) {
    await this.subscriptionRequestService.approveSubscriptionRequest(
      requestId
    );

    await this.statisticService.updateStatistic({ newSubscribtionRequest: -1, newSubscribedUser: 1 })

    return { message: 'Subscription request approved successfully' }
  }

}

@UseGuards(AdminGuard)
@Controller('subscription-offer')
export class SubscriptionOfferController {
  constructor(private readonly subscriptionOfferService: SubscriptionOfferService,
    private readonly subscriptionService: SubscriptionService,
    private readonly statisticService: StatisticService,

  ) { }


  @Get()
  async getSubscriptionOffers(
    @Query() query: PaginationQuery
  ) {
    const { page, limit } = query;

    return await this.subscriptionOfferService.getSubscriptionOffers(
      {
        limit, page
      }
    );
  }

  @Get(':domainId')
  async getSubscriptionOffersByDomain(
    @Param('domainId', ParseMonogoIdPipe) domainId: Types.ObjectId,
    @Query() query: PaginationQuery
  ) {
    const data = await this.subscriptionOfferService.getSubscriptionOffers(

      {
        limit: query.limit,
        page: query.page,

      }, { domain: domainId }

    );

    return data
  }

  @Post()
  async createSubscriptionOffer(
    @Body() body: CreateOfferBody,
  ) {
    const { description, domainId, levels, price, title, endDate } = body;

    const data = await this.subscriptionOfferService.createSubscriptionOffer(
      {
        description,
        domainId,
        levels,
        price,
        title, endDate
      }
    );

    return { data }
  }

  @Patch(':offerId')
  async updateSubscriptionOffer(
    @Param('offerId', ParseMonogoIdPipe) offerId: Types.ObjectId,
    @Body() body: updateSubscriptionOfferBody,
  ) {
    const { description, domainId, levels, price, title, endDate } = body;

    const data = await this.subscriptionOfferService.updateSubscriptionOffer(
      {
        description,
        domainId,
        levels,
        price, endDate,
        title,
        subscriptionOfferId: offerId
      },

    );

    return { data }
  }

  @Delete(':offerId')
  async deleteSubscriptionOffer(
    @Param('offerId', ParseMonogoIdPipe) offerId: Types.ObjectId,
  ) {

    await this.subscriptionOfferService.deleteSubscriptionOffer(
      offerId
    );

   const numSub = await this.subscriptionService.cancelOfferSubscription(offerId)

    await this.statisticService.updateStatistic({ newSubscribedUser: -numSub })

    return { message: 'Subscription offer deleted successfully' }
  }

}
