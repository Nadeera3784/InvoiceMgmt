// import controllers
const createController = require('../../controllers/createController');
const assert = require('chai').assert;
const httpMocks = require('node-mocks-http');


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
});

