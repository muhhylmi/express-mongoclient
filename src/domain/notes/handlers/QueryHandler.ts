import { Request, Response, response } from "express";
import { wrapperResponseError, wrapperResponse } from "../../../helper/wrapper/wrapper";
import { UcQueries } from "../use_case/Queries";


class QueryHandler {

  async findById(req: Request, res: Response) {
      let id = parseInt(req.params["id"]);
      const note = await new UcQueries().findByid(id);
      if (note.err) {
        return wrapperResponseError(res, note.statusCode, note.err.message)
      }
      return wrapperResponse(res, note.statusCode, note.data)
  }

  async findAll(req: Request, res: Response) {    
      const notes = await new UcQueries().findAll();
      return wrapperResponse(res, notes.statusCode, notes.data)
  }
}

export default new QueryHandler()