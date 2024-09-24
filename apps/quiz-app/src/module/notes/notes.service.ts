import { Note, Question, User } from '@app/common/models';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotesService {
    constructor(
        @InjectModel(Note.name) private readonly noteModel: Model<Note>
    ) { }

    createNote = async (
        user: User,
        question: Question,
        details?: {
            note?: string,
            imageUrl?: string
        }
    ) => {

        const note =
            (await this.noteModel.findOne({ user, question }))
            || new this.noteModel({ user, question, notes: [] })

        if (details && (details.note || details.imageUrl))
            note.notes.push({
                note: details.note,
                imgUrl: details.imageUrl,
                index: note.notes.length
            })

        return await note.save()

    }


    getNoteById = async (id: Types.ObjectId, user: User) => {
        const note = await this.noteModel.findOne({ _id: id, user })
        if (!note) throw new HttpException('Note not found', 404)
        return note
    }

    updateNote = async (
        note: Note,
        index: number,
        updates: {
            deleteNote?: boolean,
            newNote?: string,
            newImageUrl?: string
        }
    ) => {
        const { newNote, newImageUrl, deleteNote } = updates

        const noteToUpdate = note.notes.find(n => n.index === index)
        if (!noteToUpdate) throw new HttpException('Note not found', 404)

        if (newNote) noteToUpdate.note = newNote
        if (newImageUrl) noteToUpdate.imgUrl = newImageUrl
        if (deleteNote) note.notes = note.notes.filter(n => n.index !== index)

        note.markModified('notes')

        return await note.save()
    }

    getNotedQuestions = async (user: User) => {
        const notedQuestions = await this.noteModel.find({ user }).select('question')
        return notedQuestions.map(n => n.question._id)
    }

    deleteNote = async (noteId: Types.ObjectId, user: User) => {
        await this.noteModel.findOneAndDelete({ _id: noteId, user })
    }

}
