import mongoose, { Schema, Document, Types } from 'mongoose';

interface OldQuestion extends Document {

    source: Types.ObjectId,
    year: number,
    sources: {
        source: Types.ObjectId,
        year: number,
    }[],
}

const sourceSchame = new Schema({

    source: Types.ObjectId,
    year: Number,
}, { _id: false });


// Define Old Question Schema
const QuestionSchema = new Schema<OldQuestion>({

    source: { type: Schema.Types.ObjectId, ref: 'Source' },
    year: Number,

    sources: [sourceSchame],


});

// Model for the Question
const Question = mongoose.model<OldQuestion>('Question', QuestionSchema);


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




            question.sources = [
                {
                    source: question.source,
                    year: question.year
                }
            ]

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
