import { BinaryLike, hash } from "crypto"

export const hashData = (data: BinaryLike) => hash('sha256', data)
export const compareHash = (data: BinaryLike, hash: string) => hashData(data) === hash
