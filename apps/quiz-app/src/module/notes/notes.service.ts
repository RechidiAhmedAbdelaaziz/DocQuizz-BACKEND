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
        details: {
            note: string,
            imageUrl?: string
        }
    ) => {

        const note =
            (await this.noteModel.findOne({ user, question }))
            || new this.noteModel({ user, question, notes: [] })

        note.notes.push({
            note: details.note,
            imgUrl: details.imageUrl,
            index: note.notes.length
        })

        return await note.save()

    }

    getNote = async (user: User, question: Question) => {
        const note = await this.noteModel.findOne({ user, question })
        if (!note) throw new HttpException('Note not found', 404)
        return note
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

        if (newNote) noteToUpdate.note = newNote
        if (newImageUrl) noteToUpdate.imgUrl = newImageUrl
        if (deleteNote) note.notes = note.notes.filter(n => n.index !== index)

        note.markModified('notes')

        return await note.save()
    }


}