import { Request, Response } from "express";
import { Note } from "../schemas/Model";
import { wrapperResponseError, wrapperResponse } from "../../../helper/wrapper/wrapper";
import { INoteUcCommands, UcCommand } from "../use_case/Commands";
import EventKafka from "../../../helper/kafka/producer";
import {INoteRepoCommands, RepoCommands}  from "../repositories/Commands";
const repoCommand: INoteRepoCommands = new RepoCommands()
const eventKafka = new EventKafka();
const usecaseCommand: INoteUcCommands = new UcCommand(repoCommand, eventKafka)

class CommandHandler {

  async create(req: Request, res: Response) {    
    const new_note = new Note();
    new_note.name = req.body.name;
    new_note.description = req.body.description;    

    const create = await usecaseCommand.save(new_note);
    if (create.err) {
      return wrapperResponseError(res, create.statusCode, create.err.message)
    }
    return wrapperResponse(res, create.statusCode)
  }

  async delete(req: Request, res: Response) {
    let id = parseInt(req.params["id"]);
    const response = await usecaseCommand.delete(id);
    if (response.err) {
      return wrapperResponseError(res, response.statusCode, response.err.message)
    }
     return wrapperResponse(res, response.statusCode)
  }

  async update(req: Request, res: Response) {
    let id = parseInt(req.params["id"]);
    const new_note = new Note();

    new_note.id = id;
    new_note.name = req.body.name;
    new_note.description = req.body.description;

    const response = await usecaseCommand.update(new_note);
    if (response.err) {
      return wrapperResponseError(res, response.statusCode, response.err.message)
    }
     return wrapperResponse(res, response.statusCode)

  }
}

export default new CommandHandler()