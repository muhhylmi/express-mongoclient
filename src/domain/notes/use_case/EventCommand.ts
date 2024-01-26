import { Wrapper, wrapperData, wrapperError } from "../../../helper/wrapper/wrapper";
import NoteModel  from "../schemas/MongoModel";

interface INoteEventCommands {
    save(note: any): Promise<Wrapper>;
}

export class EventCommand implements INoteEventCommands {
    constructor (){}
    async save(data: any): Promise<Wrapper> {
        try {
            const jsonString = data.toString('utf-8');
            const jsonObject = JSON.parse(jsonString);
            
            const newNote = await new NoteModel({
                id: parseInt(jsonObject.id),
                name: jsonObject.name,
                description: jsonObject.description,
                createdAt: jsonObject.createdAt,
                updatedAt: jsonObject.updatedAt
            }).save();
            
            return wrapperData(200, newNote)
        } catch (error: any) {
            return wrapperError(200, error)
        }
        
    }
}
