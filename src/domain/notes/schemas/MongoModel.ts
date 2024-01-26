import mongoose, { Schema, Document } from 'mongoose';

interface INote extends Document {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const noteSchema: Schema = new Schema({
    id: { type: Number, required: true},
    name: { type: String, required: true },
    description: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
});

const NoteModel = mongoose.model('NoteModel', noteSchema, 'note');

export default NoteModel