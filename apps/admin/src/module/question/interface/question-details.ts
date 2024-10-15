import { Course, Exam, Source } from "@app/common/models";
import { Difficulty, QuestionType } from "@app/common";

export interface QuestionAnswer {
    text: string,
    isCorrect: boolean
}

export interface SubQuestion {
    text: string,
    answers: QuestionAnswer[],
    difficulty: Difficulty,
    type?: QuestionType,
    explanation?: string
}

export interface QuestionDetails {
    caseText?: string,
    questions: SubQuestion[],
    exams?: Exam[],
    course?: Course,
    sources: {
        source: Source,
        year: number
    }[],
    year?: number,
}