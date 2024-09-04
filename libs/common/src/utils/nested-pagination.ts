import { FilterQuery, Model } from "mongoose";

export class NestedPagination<T> {

    constructor(
        private readonly list: T[],
        private readonly options?: {
            page?: number;
            limit?: number;
            total: number;
        }
    ) { }


    generate<T>() {

        const page = this.options.page || 1;
        const limit = this.options.limit || 10;
        const total = this.options.total;

        const currentPage = Math.min(page, Math.ceil(total / limit));

        return {
            pagination: {
                page: currentPage || 0,
                length: this.list.length,
                total,
                next: total > currentPage * limit ? currentPage + 1 : undefined,
                prev: currentPage > 1 ? currentPage - 1 : undefined,
            },
            data: this.list
        }
    }



}