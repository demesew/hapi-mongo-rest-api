const chai = require('chai');
const chaiHttp = require('chai-http');
const database = require('../lib/database');
const Monster = require('../models/monster.model');
const User = require('../models/user.model');
const app = require('../app');

const assert = chai.assert;
const DB_URI = process.env.DB_URI || 'mongodb://localhost/godzilla';

chai.use(chaiHttp);

describe('End to End Testing', () => {

  let request;

  before(done => {
    request = chai.request(app);

    database.connect(DB_URI);

    done();
  });

  describe('Monster', () => {

    before(done => {
      // Wipes collection
      Monster
        .remove({})
        .then(done());
    });

    it('Posts one item to db', done => {
      let monster = 'Mothra';
      request
        .post('/monsters')
        .set('content-type', 'application/json')
        .send({name: monster, citiesRazed: 25})
        .end((err, res) => {
          let resObj = JSON.parse(res.text);
          assert.equal(resObj.result.name, monster);
          done();
        });
    });

    it('Posts another item and gets two items', done => {
      let monster = 'Destroyah';
      request
        .post('/monsters')
        .set('content-type', 'application/json')
        .send({name: monster, citiesRazed: 50})
        .then(() => {
          request
            .get('/monsters')
            .set('content-type', 'application/json')
            .end((err, res) => {
              let parse = JSON.parse(res.text);
              assert.equal(parse.result.length, 2);
              done();
            });
        });
    });

    it('Returns sum of all citiesRazed', done => {
      let expected = 75; // From the two posts above, we combine 25 and 50
      request
        .get('/monsters/totalDestruction')
        .set('content-type', 'application/json')
        .end((err, res) => {
          let parse = JSON.parse(res.text);
          let resTotal = parse.result.total_cities_razed;
          assert.equal(resTotal, expected);
          done();
        });
    });

    it('Throws specific validation error on name requirement', done => {
      let expected = 'Path `name` is required.';
      request
        .post('/monsters')
        .set('content-type', 'application/json')
        .send({'citiesRazed': 300})
        .end((err, res) => {
          let parsed = JSON.parse(res.text);
          assert.deepEqual(parsed.result, expected);
          done();
        });
    });

    it('Throws specific validation error on negative number', done => {
      let expected = 'citiesRazed cannot be a negative value';
      request
        .post('/monsters')
        .set('content-type', 'application/json')
        .send({'name': 'Zilla', 'citiesRazed': -1})
        .end((err, res) => {
          let parsed = JSON.parse(res.text);
          assert.deepEqual(parsed.result, expected);
          done();
        });
    });

    it('Gets one single item', done => {
      request
        .get('/monsters/Mothra')
        .set('content-type', 'application/json')
        .end((err, res) => {
          let parsed = JSON.parse(res.text);
          assert.equal(parsed.result[0].name, 'Mothra');
          done();
        });
    });

    it('Puts, doubles citiesRazed count from 50 to 100', done => {
      request
        .put('/monsters/Destroyah')
        .set('content-type', 'application/json')
        .send({citiesRazed: 100})
        .then(() => {
          request
            .get('/monsters/Destroyah')
            .set('content-type', 'application/json')
            .end((err, res) => {
              let parsed = JSON.parse(res.text);
              assert.equal(parsed.result[0].citiesRazed, 100);
              done();
            });
        });
    });

    it('Deletes one, then the other', done => {
      let expected = 'There are no monsters yet. Post here to start adding some.';
      request
        .del('/monsters/Destroyah')
        .set('content-type', 'application/json')
        .then(() => {
          request
            .del('/monsters/Mothra')
            .set('content-type', 'application/json')
            .then(() => {
              request
                .get('/monsters')
                .set('content-type', 'application/json')
                .end((err, res) => {
                  let parsed = JSON.parse(res.text);
                  assert.equal(parsed.result, expected);
                  done();
                });
            });
        });
    });

  });

  describe('User', () => {

    before(done => {
      // Wipes collection
      User
        .remove({})
        .then(done());
    });

    it('Posts one user to users collection', done => {
      let userName = 'Johnny';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .send({
          name: userName
        })
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.equal(resObj.status, 'posted');
          assert.property(resObj, 'result');
          assert.isObject(resObj.result);
          assert.property(resObj.result, '_id');
          assert.property(resObj.result, 'name');
          assert.equal(resObj.result.name, userName);
          assert.property(resObj.result, 'favoriteMonsters');
          assert.isArray(resObj.result.favoriteMonsters);
          assert.property(resObj.result, 'createdAt');
          assert.property(resObj.result, 'updatedAt');

          done();
        });
    });

    it('Posts another user and gets two users', done => {
      let userName = 'Don';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .send({
          name: userName
        })
        .then(() => {
          request
            .get('/users')
            .set('content-type', 'application/json')
            .end((err, res) => {
              let resObj = JSON.parse(res.text);

              assert.equal(resObj.result.length, 2);

              done();
            });
        });
    });

    it('Gets all users', done => {
      request
        .get('/users')
        .set('content-type', 'application/json')
        .then(res => {
          let resObj = JSON.parse(res.text);

          assert.equal(res.status, 200);
          assert.property(resObj, 'status');
          assert.property(resObj, 'result');
          assert.equal(resObj.status, 'success');
          assert.isArray(resObj.result);

          resObj.result.forEach(user => {
            assert.property(user, '_id');
            assert.property(user, 'name');
            assert.property(user, 'favoriteMonsters');
            assert.isArray(user.favoriteMonsters);
            assert.property(user, 'createdAt');
            assert.property(user, 'updatedAt');
          });

          done();
        });
    });

    it('Throws specific validation error on name requirement', done => {
      let expected = 'Path `name` is required.';

      request
        .post('/users')
        .set('content-type', 'application/json')
        .send({'favoriteMonsters': ['Mothra']})
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.deepEqual(resObj.result, expected);

          done();
        });
    });

    it('Gets one user', done => {
      request
        .get('/users/johnny')
        .set('content-type', 'application/json')
        .end((err, res) => {
          let resObj = JSON.parse(res.text);

          assert.equal(resObj.result.name, 'Johnny');

          done();
        });
    });

    it('Puts "Destroyah" in favoriteMonsters array', done => {
      request
        .put('/users/Johnny')
        .set('content-type', 'application/json')
        .send({
          favoriteMonsters: 'Destroyah'
        })
        .then(() => {
          request
            .get('/users/johnny')
            .set('content-type', 'application/json')
            .end((err, res) => {
              let resObj = JSON.parse(res.text);

              assert.deepEqual(resObj.result.favoriteMonsters, ['Destroyah']);

              done();
            });
        });
    });

    it('Deletes one user, then the other', done => {
      request
        .del('/users/Johnny')
        .set('content-type', 'application/json')
        .then(() => {
          request
            .del('/users/Don')
            .set('content-type', 'application/json')
            .then(() => {
              request
                .get('/users')
                .set('content-type', 'application/json')
                .end((err, res) => {
                  let resObj = JSON.parse(res.text);

                  assert.equal(resObj.result, 'There are no users yet. Post here to start adding some.');

                  done();
                });
            });
        });
    });

  });

});
