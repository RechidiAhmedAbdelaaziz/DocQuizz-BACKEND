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
    source?: Exam,
    withExplanation?: boolean,
    ids? : Types.ObjectId[],
}

