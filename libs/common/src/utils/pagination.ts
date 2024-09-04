import { IsNumber, IsNumberString, IsOptional } from "class-validator";
import { FilterQuery, Model } from "mongoose";



export class Pagination<T> {
    constructor(
        private readonly model: Model<T>,
        private readonly options?: {
            page?: number;
            limit?: number;
            filter?: FilterQuery<T>
        }

    ) { }

    getOptions() {

        const page = this.options.page || 1;
        const limit = this.options.limit || 10;
        return {
            page,
            limit,
            generate: async (list: T[]) => {
                const total = await this.model.countDocuments(this.options.filter || {});
                return this.generate(list, { page, limit, total });
            }
        }

    }

    private async generate<T>(list: T[], options: { page: number, limit: number, total: number }) {

        const { page, limit, total } = options;

        const currentPage = Math.min(page, Math.ceil(total / limit)) || 0;

        const next = total > currentPage * limit ? currentPage + 1 : undefined
        const prev = currentPage > 1 ? currentPage - 1 : undefined

        return {
            pagination: {
                page: currentPage || 0,
                length: list.length,
                total,
                next,
                prev
            },
            data: list
        }
    }
}

export class PaginationQuery {
    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;
}