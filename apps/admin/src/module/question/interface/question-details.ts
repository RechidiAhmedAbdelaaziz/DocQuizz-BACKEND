import { Exam } from "@app/common/models";

export interface QuestionDetails {
    questionText: string,
    correctAnswers: string[],
    wrongAnswers: string[],
    difficulty: "easy" | "medium" | "hard",
    source?: Exam,
    course: string,
    explanation?: string
}