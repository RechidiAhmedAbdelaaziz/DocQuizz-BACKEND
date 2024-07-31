import { HttpException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {

    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,

        });
    }

    uploadImage = async (file: Express.Multer.File, name: string) => {
        const result = await cloudinary.uploader
            .upload(
                file.path,
                {
                    folder: "DocQuizz",
                    public_id: name,
                    overwrite: true,
                }
            )
            .catch((error) => {
                throw new HttpException(error, 500)
            });

        return result.secure_url;

    }

    uploadMultiple = async (
        files?:
            {
                file: Express.Multer.File,
                name: string
            }[]
    ) => {
        const promises = files?.map(async (file) => {
            return await this.uploadImage(file.file, file.name);
        });

        return await Promise.all(promises);
    }

}