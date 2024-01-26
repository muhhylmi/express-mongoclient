import EventKafka from "../../../helper/kafka/producer";
import { Wrapper, wrapperData, wrapperError } from "../../../helper/wrapper/wrapper";
import { Commands } from "../repositories/Commands";
import { Note } from "../schemas/Model";

interface INoteUcCommands {
    save(note: Note): Promise<Wrapper>;
    update(note: Note): Promise<Wrapper>;
    delete(noteId: number): Promise<Wrapper>;
}

export class UcCommand implements INoteUcCommands {
    private command: Commands;
    private eventKafka: EventKafka
  
    constructor (){
      this.command = new Commands()
      this.eventKafka = new EventKafka()
    }

    async kafkaSendProducer(result: any ) {
      const kafkaOptions = {
        topic: 'note-created',
        body: result,
        partitionKey: result.id,
      };
      this.eventKafka.send(kafkaOptions);
    }
  
    async save(note: Note): Promise<Wrapper> {
        const res = await this.command.save(note)
        if (!res[0]) {
          return wrapperError(400, new Error('failed to create note'))  
        }
        this.kafkaSendProducer(res[0])
        return wrapperData(200)
      }

      async update(note: Note): Promise<Wrapper> {
        const new_note = await Note.findOne({
          where: {
            id: note.id,
          },
        });
        if (!new_note) {
          return wrapperError(404, new Error("Notes is not found"))  
        }
        new_note.name = note.name;
        new_note.description = note.description;
  
        await this.command.update(new_note);
        return wrapperData(200)
      }
      
      async delete(noteId: number): Promise<Wrapper> {
        const new_note = await Note.findOne({
          where: {
            id: noteId,
          },
        });
        if (!new_note) {
          return wrapperError(404, new Error("Notes is not found"))  
        }
  
        await this.command.delete(noteId);
        return wrapperData(200)
      }
    
}