import { Wrapper, wrapperData, wrapperError } from '../../../helper/wrapper/wrapper';
import { INoteRepoQueries } from '../repositories/Queries';

interface INoteUcQueries {
  findById(noteId: number): Promise<Wrapper>;
  findAll(): Promise<Wrapper>;
}

class UcQueries implements INoteUcQueries {
  private query: INoteRepoQueries;
  
  constructor (query: INoteRepoQueries){
    this.query = query;
  }
  async findById(noteId: number): Promise<Wrapper> {    
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

export { INoteUcQueries, UcQueries };