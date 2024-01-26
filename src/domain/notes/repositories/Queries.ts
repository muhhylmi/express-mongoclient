import { Note } from "../schemas/Model";

interface INoteRepoQueries {
  retrieveById(noteId: number): Promise<[Note | null, Error | null]>;
  retrieveAll(): Promise<Note[]>;
}

export class Queries implements INoteRepoQueries {
  async retrieveById(noteId: number): Promise<[Note | null, Error | null]> {
      const new_note = await Note.findOne({
        where: {
          id: noteId,
        },
      });
      if (!new_note) {
        return [null, new Error("Note not found!")];
      }
      return [new_note, null];
  }
  
  async retrieveAll(): Promise<Note[]> {
    try {
     return await Note.findAll();
    } catch (error) {
      throw new Error("Failed to create note!");
    }
  }
  
}