import { Course, Exam, Source } from "@app/common/models";
import { QuestionAnswer } from "../dto/create-question.dto";

export interface QuestionDetails {
    questionText: string,
    answers: QuestionAnswer[],
    difficulty: "easy" | "medium" | "hard",
    exam?: Exam,
    course?: Course,
    explanation?: string,
    source?: Source,
    year?: number,


}