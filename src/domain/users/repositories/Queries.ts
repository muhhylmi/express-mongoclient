import { User } from "../schemas/Model";

interface INoteRepoQueries {
  retrieveById(noteId: number): Promise<[User | null, Error | null]>;
  retrieveAll(): Promise<User[]>;
  login(username: string): Promise<[User | null, Error | null]>
}

export class Queries implements INoteRepoQueries {
  async retrieveById(userId: number): Promise<[User | null, Error | null]> {
      const new_note = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!new_note) {
        return [null, new Error("User not found!")];
      }
      return [new_note, null];
  }
  
  async retrieveAll(): Promise<User[]> {
    try {
     return await User.findAll();
    } catch (error) {
      throw new Error("Failed to get user!");
    }
  }

  async login(username: string): Promise<[User | null, Error | null]> {
    const new_note = await User.findOne({
      where: {
        username: username
      },
    });
    if (!new_note) {
      return [null, new Error("User not found!")];
    }
    return [new_note, null];
}
  
}