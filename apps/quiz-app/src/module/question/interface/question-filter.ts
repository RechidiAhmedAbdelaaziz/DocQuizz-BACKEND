import { Exam } from "@app/common/models";

export interface QuestionFilter {
    fields?: {
        level: string,
        major: string,
        course: string
    }[],
    difficulties?: ("easy" | "medium" | "hard")[],
    types?: ("QCM" | "QCU")[],
    source?: Exam,
    alreadyAnsweredFalse?: boolean,
    withExplanation?: boolean,
    withNotes?: boolean
}

