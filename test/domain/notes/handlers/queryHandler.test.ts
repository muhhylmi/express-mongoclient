import { Request, Response } from 'express';
import sinon, { SinonStub } from 'sinon';
import QueryHandler from '../../../../src/domain/notes/handlers/QueryHandler';
import { UcQueries } from '../../../../src/domain/notes/use_case/Queries';
import * as wrapper from '../../../../src/helper/wrapper/wrapper';

describe('QueryHandler', () => {
  let res: Response;

  beforeEach(() => {
    res = {} as Response;
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
  });

  describe('findById', () => {
    it('should handle findById successfully', async () => {
      const req: Request = {} as Request;
      req.params = { id: '1' };
      const usecaseQueriesStub: SinonStub = sinon.stub(UcQueries.prototype, 'findById').resolves({
        statusCode: 200,
        data: { id: 1 }
      });
      const wrapperResponseStub: SinonStub = sinon.stub(wrapper, 'wrapperResponse');
      await QueryHandler.findById(req, res);      

      sinon.assert.calledWithExactly(wrapperResponseStub, res, 200, { id: 1 });

      usecaseQueriesStub.restore();
      wrapperResponseStub.restore();
    });

    it('should handle findById with error', async () => {
      const req: Request = {} as Request;
      req.params = { id: '1' };
      const usecaseQueriesStub = sinon.stub(UcQueries.prototype, 'findById').resolves({
        statusCode: 500,
        err: new Error('Internal Server Error'),
      });

      const wrapperResponseErrorStub: SinonStub = sinon.stub(wrapper, 'wrapperResponseError');

      await QueryHandler.findById(req, res);

      sinon.assert.calledWithExactly(wrapperResponseErrorStub, res, 500, 'Internal Server Error');

      usecaseQueriesStub.restore();
      wrapperResponseErrorStub.restore();
    });
  });

  describe('findAll', () => {
    it('should handle findAll successfully', async () => {
      const req: Request = {} as Request;
      const usecaseQueriesStub = sinon.stub(UcQueries.prototype, 'findAll').resolves({
        statusCode: 200,
        data: [{ id: 1, content: 'Note 1' }, { id: 2, content: 'Note 2' }],
      });
      const wrapperResponseStub: SinonStub = sinon.stub(wrapper, 'wrapperResponse');
      await QueryHandler.findAll(req, res);

      sinon.assert.calledWithExactly(wrapperResponseStub, res, 200, [{ id: 1, content: 'Note 1' }, { id: 2, content: 'Note 2' }]);

      usecaseQueriesStub.restore();
    });
  });


});
