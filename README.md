# Hapi Mongo Rest API

One resource REST API backed with HapiJS and MongoDB (using Mongoose)

## Getting Started

1. Install [Node.js](https://nodejs.org/en/).
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/).
3. Install [Postman](https://www.getpostman.com).
4. Run `git clone https://github.com/DonChatelain/express-mongo-rest-api.git`.
5. Run `cd express-mongo-rest-api`.
6. Run `npm install`.
7. Run `npm start`.
8. Use Postman to make requests.

## API

All requests must have `application/json` for `content-type` in the headers.

### Users

#### Get all users

```
GET /users
```

#### Get single user

```
GET /users/:name
```

#### Create user

```
POST /users
```

#### Update user

```
PUT /users/:name
PATCH /users/:name
```

#### Remove user

```
DELETE /users/:name
```

## Tests

Run `npm test` to see unit and end to end testing.
