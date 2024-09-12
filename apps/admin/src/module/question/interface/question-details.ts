import { Course, Exam, Source } from "@app/common/models";

export interface QuestionDetails {
    questionText: string,
    correctAnswers: string[],
    wrongAnswers: string[],
    difficulty: "easy" | "medium" | "hard",
    exam?: Exam,
    course?: Course,
    explanation?: string,
    source?: Source,
    year?: number,


}