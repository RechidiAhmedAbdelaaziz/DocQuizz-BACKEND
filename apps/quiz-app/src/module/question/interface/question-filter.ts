import { Exam } from "@app/common/models";
import { Types } from "mongoose";

export interface QuestionFilter {
    fields?: {
        level: string,
        major: string,
        course: string
    }[],
    difficulties?: ("easy" | "medium" | "hard")[],
    types?: ("QCM" | "QCU")[],
    exam?: Exam,
    withExplanation?: boolean,
    ids? : Types.ObjectId[],
    keywords ?: string,
    sources ? : string[],
    years ? : number[]
}

