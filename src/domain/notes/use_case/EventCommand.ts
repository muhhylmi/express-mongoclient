import { Wrapper, wrapperData, wrapperError } from '../../../helper/wrapper/wrapper';
import NoteModel  from '../schemas/MongoModel';

interface INoteEventCommands {
    save(note: Buffer): Promise<Wrapper>;
}
class EventCommand implements INoteEventCommands {
  constructor (){}
  async save(data: Buffer| null): Promise<Wrapper> {
    try {
      if (data != null) {
        const jsonString = data.toString('utf-8');
        const jsonObject = JSON.parse(jsonString);
              
        const newNote = await new NoteModel({
          id: parseInt(jsonObject.id),
          name: jsonObject.name,
          description: jsonObject.description,
          createdAt: jsonObject.createdAt,
          updatedAt: jsonObject.updatedAt
        }).save();
              
        return wrapperData(200, newNote); 
      }
      return wrapperData(200);
    } catch (error) {
      return wrapperError(400, new Error('Cannot create note from event'));
    }
        
  }
}

export { INoteEventCommands, EventCommand };
