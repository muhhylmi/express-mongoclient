import { Wrapper, wrapperData, wrapperError } from "../../../helper/wrapper/wrapper";
import { Queries } from "../repositories/Queries";
import { User } from "../schemas/Model";

interface INoteUcQueries {
  findByid(userId: number): Promise<Wrapper>;
  findAll(): Promise<Wrapper>;
}

export class UcQueries implements INoteUcQueries {
  private query: Queries;
  
  constructor (){
    this.query = new Queries()
  }
    async findByid(userId: number): Promise<Wrapper> {
        const note = await this.query.retrieveById(userId);
        if (note[1]) {
          return wrapperError(404, new Error("User Is Not Found"))
        }
        return wrapperData(200, note[0]);
    }
    
    async findAll(): Promise<Wrapper> {
        const note = await this.query.retrieveAll();
        return wrapperData(200, note);
    }
    
}