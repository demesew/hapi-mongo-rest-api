const userModel = require('../models/user.model.js');

const userRoutes = [
  {
    method: 'GET',
    path: '/users',
    handler: (request, reply) => {
      userModel
        .find()
        .then(users => {
          let response = {
            status: 'success',
            results: 'There are no users.',
          };

          if (users.length) {
            response.results = users;
          }

          reply(response);
        });
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
      new userModel(request.payload)
        .save()
        .then(user => {
          reply({
            status: 'success',
            results: user
          });
        }).catch(() => {
          reply({
            status: 'error',
            results: 'The firstName and lastName fields are required. The age field is optional.'
          });
        });
    }
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request, reply) => {
      let userId = encodeURIComponent(request.params.id);

      userModel
        .findOne({
          _id: userId
        })
        .then(user => {
          reply({
            status: 'success',
            results: user
          });
        })
        .catch(() => {
          reply({
            status: 'error',
            results: `User with an ID of ${userId} does not exist.`
          });
        });
    }
  },
  {
    method: ['PUT', 'PATCH'],
    path: '/users/{id}',
    handler: (request, reply) => {
      let userId = encodeURIComponent(request.params.id);

      userModel
        .findOneAndUpdate({
          _id: userId
        }, request.payload, {
          new: true,
          upsert: true,
          runValidators: true
        })
        .then(user => {
          reply({
            status: 'success',
            results: user
          });
        })
        .catch(() => {
          reply({
            status: 'error',
            results: `User with an ID of ${userId} does not exist.`
          });
        });
    }
  },
  {
    method: 'DELETE',
    path: '/users/{id}',
    handler: (request, reply) => {
      let userId = encodeURIComponent(request.params.id);

      userModel
        .findOneAndRemove({
          _id: userId
        })
        .then(user => {
          reply({
            status: 'success',
            results: user
          });
        })
        .catch(() => {
          reply({
            status: 'error',
            results: `User with an ID of ${userId} does not exist.`
          });
        });
    }
  }
];

module.exports = userRoutes;
