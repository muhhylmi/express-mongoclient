import { Wrapper, wrapperData, wrapperError } from '../../../helper/wrapper/wrapper';
import { Queries } from '../repositories/Queries';

interface INoteUcQueries {
  findByid(noteId: number): Promise<Wrapper>;
  findAll(): Promise<Wrapper>;
}

export class UcQueries implements INoteUcQueries {
  private query: Queries;
  
  constructor (){
    this.query = new Queries();
  }
  async findByid(noteId: number): Promise<Wrapper> {
    const note = await this.query.retrieveById(noteId);
    if (note[1]) {
      return wrapperError(404, new Error('Note Is Not Found'));
    }
    return wrapperData(200, note[0]);
  }
    
  async findAll(): Promise<Wrapper> {
    const note = await this.query.retrieveAll();
    return wrapperData(200, note);
  }
    
}