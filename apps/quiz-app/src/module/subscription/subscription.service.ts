import { Subscription, SubscriptionRequest, SubscriptionOffer } from '@app/common/models/subscription.model';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class SubscriptionRequestService {

    constructor(
        @InjectModel(SubscriptionRequest.name) private readonly subscriptionRequestModel: Model<SubscriptionRequest>,
        @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    ) { }


    async getSubscriptionRequests(
        pagination: {
            page?: number;
            limit?: number;
        }
    ) {
        const { generate, limit, page } = new Pagination(this.subscriptionRequestModel, { ...pagination }).getOptions();

        const subscriptionRequests = await this.subscriptionRequestModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user')
            .populate('offer');



        return await generate(subscriptionRequests);
    }

    async createSubscriptionRequest(
        args: {
            userId: Types.ObjectId;
            offerId: Types.ObjectId;
            image: string;
        }
    ) {
        const { userId, offerId, image } = args;

        const subscriptionRequest = new this.subscriptionRequestModel({
            user: userId,
            offer: offerId,
            proof: image,
        });

        return subscriptionRequest.save();
    }


    async approveSubscriptionRequest(requestId: Types.ObjectId) {
        const subscriptionRequest = await this.subscriptionRequestModel.findById(requestId);

        if (!subscriptionRequest) throw new HttpException('Subscription request not found', HttpStatus.NOT_FOUND);

        const subscription = new this.subscriptionModel({
            user: subscriptionRequest.user,
            offer: subscriptionRequest.offer,
            endDate: new Date(new Date().getFullYear() + (new Date().getMonth() > 8 ? 1 : 0), 8, 1),
        });

        await Promise.all([
            subscriptionRequest.deleteOne(),
            subscription.save(),
        ]);

        return subscription;

    }


    async cancelSubscriptionRequest(requestId: Types.ObjectId) {
        const subscriptionRequest = await this.subscriptionRequestModel.findById(requestId);

        if (!subscriptionRequest) throw new HttpException('Subscription request not found', HttpStatus.NOT_FOUND);

        await subscriptionRequest.deleteOne();
    }

}

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private readonly subscriptionModel: Model<Subscription>,
    ) { }

    async getSubscriptions(
        filter: {
            user?: Types.ObjectId;
            offer?: Types.ObjectId;
        },
        pagination: {
            page?: number;
            limit?: number;
        }
    ) {
        const { generate, limit, page } = new Pagination(this.subscriptionModel, { filter, ...pagination }).getOptions();

        const subscriptions = await this.subscriptionModel
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('user')
            .populate('offer')
            .populate('offer.domain')
            .populate('offer.levels')
            .sort({ 'createdAt': -1 });

        return await generate(subscriptions);
    }

    async cancelSubscription(
        subscriptionId: Types.ObjectId
    ) {
        const subscription = await this.subscriptionModel.findById(subscriptionId);

        if (!subscription) throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

        await subscription.deleteOne();
    }

    async createSubscription(
        args: {
            userId: Types.ObjectId;
            offerId: Types.ObjectId;
        }
    ) {
        const { userId, offerId } = args;

        const subscription = new this.subscriptionModel({
            user: userId,
            offer: offerId,
            endDate: new Date(new Date().getFullYear() + (new Date().getMonth() > 8 ? 1 : 0), 8, 1),
        });

        return subscription.save();
    }



}


@Injectable()
export class SubscriptionOfferService {
    constructor(
        @InjectModel(SubscriptionOffer.name) private readonly subscriptionModel: Model<SubscriptionOffer>,
    ) { }

    async getSubscriptionOffers(
        pagination: {
            page?: number;
            limit?: number;
        }
    ) {
        const { generate, limit, page } = new Pagination(this.subscriptionModel, { ...pagination }).getOptions();

        const subscriptions = await this.subscriptionModel
            .find()
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('domain')
            .populate('levels')
            .sort({ 'createdAt': -1 });

        return await generate(subscriptions);
    }

    async createSubscriptionOffer(
        args: {
            title: string;
            domainId: Types.ObjectId;
            levels: Types.ObjectId[];
            description: string;
            price: number;
        }
    ) {
        const { title, domainId, levels, description, price } = args;

        const subscriptionOffer = new this.subscriptionModel({
            title,
            domain: domainId,
            levels,
            description,
            price
        });

        return subscriptionOffer.save();
    }

    async updateSubscriptionOffer(
        args: {
            title?: string;
            domainId?: Types.ObjectId;
            levels?: Types.ObjectId[];
            description?: string;
            price?: number;
            subscriptionOfferId: Types.ObjectId;
        }
    ) {
        const { title, domainId, levels, description, price, subscriptionOfferId } = args;

        const subscriptionOffer = await this.subscriptionModel.findById(subscriptionOfferId)



        if (!subscriptionOffer) throw new HttpException('Subscription offer not found', HttpStatus.NOT_FOUND);

        if (title) subscriptionOffer.title = title;
        if (domainId) subscriptionOffer.domain = domainId
        if (levels) subscriptionOffer.levels = levels;
        if (description) subscriptionOffer.description = description;
        if (price) subscriptionOffer.price = price;


        await subscriptionOffer.save()


        return this.subscriptionModel.findById(subscriptionOfferId)
            .populate('domain')
            .populate('levels');
    }


    async deleteSubscriptionOffer(
        subscriptionOfferId: Types.ObjectId
    ) {
        const subscriptionOffer = await this.subscriptionModel.findById(subscriptionOfferId);

        if (!subscriptionOffer) throw new HttpException('Subscription offer not found', HttpStatus.NOT_FOUND);

        await subscriptionOffer.deleteOne();
    }

}