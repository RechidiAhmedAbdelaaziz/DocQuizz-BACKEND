import mongoose, { Schema, Document, Types } from 'mongoose';

interface OldQuestion extends Document {

    exam: Types.ObjectId,
    exams: Types.ObjectId[],
}



// Define Old Question Schema
const QuestionSchema = new Schema<OldQuestion>({

    exam: { type: Schema.Types.ObjectId, ref: 'Exam' },
    exams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],


});

// Model for the Question
const Question = mongoose.model<OldQuestion>('Question', QuestionSchema);


// Function to update all documents
async function updateQuestions() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://ahmedrechidi:3Sd-3RF-nWn-Yth@docquizzdb.unh0tmk.mongodb.net/', {
            dbName: 'DocQuizz',
        });

        // Find all documents with correctAnswers and wrongAnswers
        const questions = await Question.find({
            exams: { $exists: true },
        });

        // Loop over each question and update the structure
        for (var question of questions) {

            console.log('Updating question:', question.exams);



            // question.exams = [question.exam];
            // question.exam = undefined;

            // await question.save();
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

