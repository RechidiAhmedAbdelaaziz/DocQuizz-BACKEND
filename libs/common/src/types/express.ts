import { JwtPayload } from "../shared"

export {}

declare module 'express-serve-static-core' {
    export interface Request {
        user: JwtPayload
    }
}