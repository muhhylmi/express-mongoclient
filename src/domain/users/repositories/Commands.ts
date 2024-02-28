import { User } from '../schemas/Model';

interface IUserRepoCommands {
    save(user: User): Promise<Error | null>;
    update(user: User): Promise<Error | null>;
    delete(userId: number): Promise<void>;
}


export class Commands implements IUserRepoCommands {
  async save(user: User): Promise<Error | null> {
    try {
      await User.create({
        username: user.username,
        password: user.password,
      });
      return null;
    } catch (error) {
      return new Error('Failed to create user!');
    }
  }

  async update(user: User): Promise<Error | null> {
    try {
      const newUser = await User.findOne({
        where: {
          id: user.id,
        },
      });
      if (!newUser) {
        return new Error('Failed to update note!');
      }
      newUser.username = user.username;
      newUser.password = user.password;
      await newUser.save();
      return null;
    } catch (error) {
      return new Error('Failed to update user!');
    }
  }

  async delete(userId: number): Promise<void> {
    try {
      const newUser = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!newUser) {
        throw new Error('User not found!');
      }

      await newUser.destroy();
    } catch (error) {
      throw new Error('Failed to delete user!');
    }
  }
}