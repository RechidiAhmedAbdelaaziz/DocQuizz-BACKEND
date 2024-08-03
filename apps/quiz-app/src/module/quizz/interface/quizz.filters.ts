import { AcademicField, Course, Reference } from "@app/common/models";
import { Types } from "mongoose";

export interface QuizzFilters {
    fields?: AcademicField[];
    courses?: Course[];
    references?: Reference[];
    difficulties?: ("Easy" | "Medium" | "Hard")[]
    types?: ('QCM' | 'QCU')[]
    years?: number[]
    withExplanation?: boolean
    withNotes?: boolean
}