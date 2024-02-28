import { Request, Response } from 'express';
import { wrapperResponseError, wrapperResponse } from '../../../helper/wrapper/wrapper';
import { INoteUcQueries, UcQueries } from '../use_case/Queries';
import { INoteRepoQueries, RepoQueries } from '../repositories/Queries';
const repoQueries: INoteRepoQueries = new RepoQueries();
const usecaseQueries: INoteUcQueries = new UcQueries(repoQueries);


class QueryHandler {

  async findById(req: Request, res: Response) {
    const id = parseInt(req.params['id']);
    const note = await usecaseQueries.findById(id);
    if (note.err) {
      return wrapperResponseError(res, note.statusCode, note.err.message);
    }
    return wrapperResponse(res, note.statusCode, note.data);
  }

  async findAll(req: Request, res: Response) {    
    const notes = await usecaseQueries.findAll();
    return wrapperResponse(res, notes.statusCode, notes.data);
  }
}

export default new QueryHandler();