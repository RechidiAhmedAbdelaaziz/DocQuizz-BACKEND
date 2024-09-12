import { Exam } from "@app/common/models";

export interface QuestionDetails {
    questionText: string,
    correctAnswers: string[],
    wrongAnswers: string[],
    difficulty: "easy" | "medium" | "hard",
    exam?: Exam,
    field: {
        level: string,
        major: string,
        course: string
    },
    explanation?: string,
    source?: string,
    year?: number

}