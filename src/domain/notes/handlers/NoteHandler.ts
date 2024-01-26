import { Request, Response, response } from "express";
import { Note } from "../schemas/Model";
import { wrapperResponseError, wrapperResponse } from "../../../helper/wrapper/wrapper";
import { UcQueries } from "../use_case/Queries";
import { UcCommand } from "../use_case/Commands";


class NoteHandler {

  async create(req: Request, res: Response) {
    const new_note = new Note();
    new_note.name = req.body.name;
    new_note.description = req.body.description;    

    const create = await new UcCommand().save(new_note);
    if (create.err) {
      return wrapperResponseError(res, create.statusCode, create.err.message)
    }
    return wrapperResponse(res, create.statusCode)
  }

  async delete(req: Request, res: Response) {
    let id = parseInt(req.params["id"]);
    const response = await new UcCommand().delete(id);
    if (response.err) {
      return wrapperResponseError(res, response.statusCode, response.err.message)
    }
     return wrapperResponse(res, response.statusCode)
  }

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

  async update(req: Request, res: Response) {
    let id = parseInt(req.params["id"]);
    const new_note = new Note();

    new_note.id = id;
    new_note.name = req.body.name;
    new_note.description = req.body.description;

    const response = await new UcCommand().update(new_note);
    if (response.err) {
      return wrapperResponseError(res, response.statusCode, response.err.message)
    }
     return wrapperResponse(res, response.statusCode)

  }
}

export default new NoteHandler()