import { Request, Response, response } from "express";
import { User } from "../schemas/Model";
import { wrapperResponseError, wrapperResponse } from "../../../helper/wrapper/wrapper";
import { UcQueries } from "../use_case/Queries";
import { UcCommand } from "../use_case/Commands";


class UserHandler {

  async create(req: Request, res: Response) {
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.password = req.body.password;

    const create = await new UcCommand().save(newUser);
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
    const newUser = new User();

    newUser.id = id;
    newUser.username = req.body.username;
    newUser.password = req.body.password;

    const response = await new UcCommand().update(newUser);
    if (response.err) {
      return wrapperResponseError(res, response.statusCode, response.err.message)
    }
     return wrapperResponse(res, response.statusCode)
  }

  async login(req: Request, res: Response) {
    const newUser = new User();
    newUser.username = req.body.username;
    newUser.password = req.body.password;

    const note = await new UcCommand().login(newUser);
    if (note.err) {
      return wrapperResponseError(res, note.statusCode, note.err.message)
    }
    return wrapperResponse(res, note.statusCode, note.data)
  }
}

export default new UserHandler()