
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseMonogoIdPipe implements PipeTransform<string, Types.ObjectId> {
    transform(value: any, metadata: ArgumentMetadata): Types.ObjectId {
        if (!Types.ObjectId.isValid(value)) {
            throw new BadRequestException('Invalid ID!');
        }
        return Types.ObjectId.createFromHexString(value);
    }
}