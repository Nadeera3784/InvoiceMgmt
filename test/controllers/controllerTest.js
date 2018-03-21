const sinon = require('sinon');
const { assert } = require('chai').assert;
const httpMocks = require('node-mocks-http');
// import controllers
const createController = require('../../controllers/createController');
// // import Model
// const Invoice = require('mock-mongoose-model');
const Invoice = require('../../models/invoice');

describe('Controllers Test', () => {
  describe('Index Route', () => {
    it('Should return 200 Status code', (done) => {
      const req = httpMocks.createRequest({ method: 'GET', url: '/' });
      const res = httpMocks.createResponse({ statusCode: 200, eventEmitter: require('events').EventEmitter });      
      res.on('end', () => {
        assert.equal(res.statusCode, 200);
        done();
      });
      createController.get(req, res);
    });
  });
  // describe('Create Route', () => {
  //   sinon.stub(Invoice, 'save').returns('Invoice Created');
  //   const req = httpMocks.createRequest({ method: 'POST', url: '/' });
  //   const res = { data: Invoice.save() };
  //   beforeEach(() => {
  //     sinon.stub(Invoice, 'save');
  //   });
  //   afterEach(() => {
  //     Invoice.save.restore();
  //   });

  //   it('Should return Success on save', () => {
  //     const expected = 'Invoice Created';
  //     createController.post(req, res);
  //     assert.equal(res.data, expected);
  //   });
  // });
});

