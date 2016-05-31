const chai = require('chai');
const chaiHttp = require('chai-http');
const Hapi = require('hapi');
const config = require('../lib/config');
const database = require('../lib/database');
const userModel = require('../models/user.model');
const userRoutes = require('../routes/user.routes');

const assert = chai.assert;
const server = new Hapi.Server();

chai.use(chaiHttp);

describe('End to End Testing', () => {

  let request;

  before(done => {
    server.connection({
      host: config.host,
      port: config.port
    });

    server.route(userRoutes);

    server.start(err => {
      if (err) return console.error(err);

      console.log('Magic happens at', server.info.uri);

      database.connect(config.db_uri);

      request = chai.request(server.info.uri);

      done();
    });
  });

  describe('User', () => {

    let userId;

    before(done => {
      userModel
        .remove({})
        .then(done());
    });

    it('POSTs one user to users collection', done => {
      let body = {
        firstName: 'Johnny',
        lastName: 'Luangphasy',
        age: 26
      };

      request
        .post('/users')
        .set('content-type', 'application/json')
        .send(body)
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'success');
          assert.property(resObj, 'results');
          assert.isObject(resObj.results);
          assert.property(resObj.results, '_id');
          assert.property(resObj.results, 'firstName');
          assert.equal(resObj.results.firstName, body.firstName);
          assert.property(resObj.results, 'lastName');
          assert.equal(resObj.results.lastName, body.lastName);
          assert.property(resObj.results, 'age');
          assert.equal(resObj.results.age, body.age);
          assert.property(resObj.results, 'createdAt');
          assert.property(resObj.results, 'updatedAt');

          userId = resObj.results._id;

          done();
        });
    });

    it('GETs all users', done => {
      request
        .get('/users')
        .set('content-type', 'application/json')
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.property(resObj, 'results');
          assert.equal(resObj.status, 'success');
          assert.isArray(resObj.results);

          resObj.results.forEach(user => {
            assert.property(user, '_id');
            assert.property(user, 'firstName');
            assert.property(user, 'lastName');
            assert.property(user, 'age');
            assert.property(user, 'createdAt');
            assert.property(user, 'updatedAt');
          });

          done();
        });
    });

    it('GETs one user by ID', done => {
      request
        .get(`/users/${userId}`)
        .set('content-type', 'application/json')
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'success');
          assert.property(resObj, 'results');
          assert.property(resObj.results, 'firstName');
          assert.equal(resObj.results.firstName, 'Johnny');
          assert.property(resObj.results, 'lastName');
          assert.equal(resObj.results.lastName, 'Luangphasy');
          assert.property(resObj.results, 'age');
          assert.equal(resObj.results.age, 26);
          assert.property(resObj.results, 'createdAt');
          assert.property(resObj.results, 'updatedAt');

          done();
        });
    });

    it('PUTs new age by making request with ID', done => {
      request
        .put(`/users/${userId}`)
        .set('content-type', 'application/json')
        .send({
          age: 21
        })
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'success');
          assert.property(resObj, 'results');
          assert.property(resObj.results, '_id');
          assert.equal(resObj.results._id, userId);
          assert.property(resObj.results, 'firstName');
          assert.equal(resObj.results.firstName, 'Johnny');
          assert.property(resObj.results, 'lastName');
          assert.equal(resObj.results.lastName, 'Luangphasy');
          assert.property(resObj.results, 'age');
          assert.equal(resObj.results.age, 21);
          assert.property(resObj.results, 'createdAt');
          assert.property(resObj.results, 'updatedAt');

          done();

        });
    });

    it('DELETEs one user, then the other', done => {
      request
        .del(`/users/${userId}`)
        .set('content-type', 'application/json')
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'success');
          assert.property(resObj, 'results');
          assert.property(resObj.results, '_id');
          assert.equal(resObj.results._id, userId);
          assert.property(resObj.results, 'firstName');
          assert.equal(resObj.results.firstName, 'Johnny');
          assert.property(resObj.results, 'lastName');
          assert.equal(resObj.results.lastName, 'Luangphasy');
          assert.property(resObj.results, 'age');
          assert.equal(resObj.results.age, 21);
          assert.property(resObj.results, 'createdAt');
          assert.property(resObj.results, 'updatedAt');

          request
            .get('/users')
            .set('content-type', 'application/json')
            .then(res => {
              resObj = JSON.parse(res.text);

              assert.equal(res.status, 200);
              assert.property(resObj, 'status');
              assert.equal(resObj.status, 'success');
              assert.property(resObj, 'results');
              assert.equal(resObj.results, 'There are no users.');

              done();
            });
        });
    });

  });

});
