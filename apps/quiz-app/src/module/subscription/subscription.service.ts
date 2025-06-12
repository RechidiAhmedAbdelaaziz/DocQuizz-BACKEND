import { Subscription, SubscriptionRequest, SubscriptionOffer } from '@app/common/models/subscription.model';
import { Pagination } from '@app/common/utils/pagination';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import path from 'path';

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
            .populate(
                {
                    path: 'user',
                    select: 'name email'
                }
            )
            .populate({
                path: 'offer',
                select: 'title price',
            })



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

        });

        await Promise.all([
            subscriptionRequest.deleteOne(),
            subscription.save(),
        ]);


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

        const subscriptions = await this.subscriptionModel.aggregate([
            // Match your filter
            { $match: filter },

            // Join with 'users' collection
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' }, // Flatten the array

            // Join with 'offers' collection
            {
                $lookup: {
                    from: 'offers',
                    localField: 'offer',
                    foreignField: '_id',
                    as: 'offer',
                },
            },
            { $unwind: '$offer' }, // Flatten the array

            // Project only required fields
            {
                $project: {
                    _id: 1,
                    createdAt: 1,
                    user: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                    offer: {
                        _id: 1,
                        title: 1,
                        price: 1,
                        endDate: 1,
                    },
                },
            },

            // Sort by user.email
            {
                $sort: { 'user.email': 1 }, // 1 = ascending, -1 = descending
            },

            // Pagination
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]);


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
        });

        await subscription.save();

        return this.subscriptionModel.findById(subscription._id)
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate(
                {
                    path: 'offer',
                    select: 'title price levels domain endDate',
                    populate: 'domain levels'
                }
            )

    }


    async cancelOfferSubscription(offerId: Types.ObjectId) {
        const subscriptions = await this.subscriptionModel.find({ offer: offerId });

        if (!subscriptions) throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);

        const { length } = await Promise.all(subscriptions.map((subscription) => subscription.deleteOne()));

        return length;
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
        },
        filter?: {
            domain?: Types.ObjectId;
        },
    ) {
        const { domain } = filter || {};

        const filters: FilterQuery<SubscriptionOffer> = {};

        if (domain) filters.domain = domain;


        const { generate, limit, page } = new Pagination(this.subscriptionModel, { ...pagination }).getOptions();

        const subscriptions = await this.subscriptionModel
            .find(filters)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('domain')
            .populate('levels')
        // .sort({ 'createdAt': -1 });

        return await generate(subscriptions);
    }

    async createSubscriptionOffer(
        args: {
            title: string;
            domainId: Types.ObjectId;
            levels: Types.ObjectId[];
            description: string;
            price: number;
            endDate: Date;
        }
    ) {
        const { title, domainId, levels, description, price, endDate } = args;

        const subscriptionOffer = new this.subscriptionModel({
            title,
            domain: domainId,
            levels,
            description,
            price,
            endDate,
        });

        await subscriptionOffer.save();

        return this.subscriptionModel.findById(subscriptionOffer._id)
            .populate('domain')
            .populate('levels');

    }

    async updateSubscriptionOffer(
        args: {
            title?: string;
            domainId?: Types.ObjectId;
            levels?: Types.ObjectId[];
            description?: string;
            price?: number;
            endDate?: Date;
            subscriptionOfferId: Types.ObjectId;
        }
    ) {
        const { title, domainId, levels, description, price, subscriptionOfferId, endDate } = args;

        const subscriptionOffer = await this.subscriptionModel.findById(subscriptionOfferId)



        if (!subscriptionOffer) throw new HttpException('Subscription offer not found', HttpStatus.NOT_FOUND);

        if (title) subscriptionOffer.title = title;
        if (domainId) subscriptionOffer.domain = domainId
        if (levels) subscriptionOffer.levels = levels;
        if (description) subscriptionOffer.description = description;
        if (price) subscriptionOffer.price = price;
        if (endDate) {
            subscriptionOffer.endDate = endDate;
            subscriptionOffer.markModified('endDate');
        }



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