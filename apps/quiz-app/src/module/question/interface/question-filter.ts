import { Course, Exam, Source } from "@app/common/models";
import { Types } from "mongoose";

export interface QuestionFilter {
    courses?: Types.ObjectId[],
    difficulties?: ("easy" | "medium" | "hard")[],
    types?: ("QCM" | "QCU")[],
    exam?: Exam,
    withExplanation?: boolean,
    ids?: Types.ObjectId[],
    keywords?: string,
    sources?: Types.ObjectId[],
    year?: number
}

