import { Note } from "../schemas/Model";

interface INoteRepoCommands {
    save(note: Note): Promise<[Note | null, Error | null]>;
    update(note: Note): Promise<Error | null>;
    delete(noteId: number): Promise<void>;
}

class RepoCommands implements INoteRepoCommands {
    async save(note: Note): Promise<[Note | null, Error | null]> {
        try {
          const created = await Note.create({
            name: note.name,
            description: note.description,
          });
          return [created.dataValues, null]
        } catch (error) {
          return [null, new Error("Failed to create note!")]
        }
      }

      async update(note: Note): Promise<Error | null>{
        try {
          const new_note = await Note.findOne({
            where: {
              id: note.id,
            },
          });
          if (!new_note) {
            return new Error("Failed to update note!")
          }
          new_note.name = note.name;
          new_note.description = note.description;
          await new_note.save();
          
          return null
        } catch (error) {
          return new Error("Failed to update note!")
        }
      }
      
      async delete(noteId: number): Promise<void> {
        try {
          const new_note = await Note.findOne({
            where: {
              id: noteId,
            },
          });
          if (!new_note) {
            throw new Error("Note not found!");
          }
    
          await new_note.destroy();
        } catch (error) {
          throw new Error("Failed to create note!");
        }
      }
}

export { INoteRepoCommands, RepoCommands }