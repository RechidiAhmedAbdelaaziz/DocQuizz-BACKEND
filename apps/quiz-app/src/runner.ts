import mongoose, { Schema, Document } from 'mongoose';

interface OldQuestion extends Document {
    questionText: string;
    answers: {
        text: string;
        isCorrect: boolean;
    }[];
    difficulty: "easy" | "medium" | "hard";
    type: "QCM" | "QCU";
    exam?: Schema.Types.ObjectId;
    course: Schema.Types.ObjectId;
    explanation?: string;
    source: Schema.Types.ObjectId;
    year: number;
    //add new fields
    withExplanation: boolean;
    difficulties: string[];
    questions: {
        text: string;
        answers: {
            text: string;
            isCorrect: boolean;
        }[];
        difficulty: "easy" | "medium" | "hard";
        type: "QCM" | "QCU";
        explanation?: string;
    }[];
}

const questionSchema = new Schema({

    text: String,
    answers: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    type: { type: String, enum: ["QCM", "QCU"] },
    explanation: String,
}, { _id: false });


// Define Old Question Schema
const OldQuestionSchema = new Schema<OldQuestion>({
    questionText: String,
    answers: [
        {
            text: String,
            isCorrect: Boolean,
        },
    ],
    difficulty: { type: String, enum: ["easy", "medium", "hard"] },
    type: { type: String, enum: ["QCM", "QCU"] },
    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    explanation: String,
    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    year: Number,
    //add new fields
    withExplanation: Boolean,
    difficulties: [String],
    questions: [questionSchema],


});

// Model for the Question
const Question = mongoose.model<OldQuestion>('Question', OldQuestionSchema);

// Function to transform the structure
function transformAnswers(old: OldQuestion) {
    return {

        questions: [{
            text: old.questionText,
            answers: old.answers,
            difficulty: old.difficulty,
            type: old.type,
            explanation: old.explanation,
        }],
        type: old.type,
        exam: old.exam,
        course: old.course,
        source: old.source,
        year: old.year,
        withExplanation: !!old.explanation,
        difficulties: [old.difficulty],

    };
}

// Function to update all documents
async function updateQuestions() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017', {
            dbName: 'DocQuizz',
        });

        // Find all documents with correctAnswers and wrongAnswers
        const questions = await Question.find({

        });

        // Loop over each question and update the structure
        for (var question of questions) {



            
            question.type = question.questions[0].type;
            








            


            // Save the updated document
            await question.save();
        }

        console.log('All questions updated successfully.');
        mongoose.disconnect();
    } catch (error) {
        console.error('Error updating questions:', error);
        mongoose.disconnect();
    }
}

// Run the update function
updateQuestions();
