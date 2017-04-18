# Hapi Mongo Rest API

One resource REST API backed with Hapi.js and MongoDB (using Mongoose).

## Getting Started

1. Install [Node.js](https://nodejs.org/en/).
2. Install [MongoDB](https://docs.mongodb.com/manual/installation/).
3. Install [Postman](https://www.getpostman.com).
4. Run `git clone https://github.com/jluangphasy-archive/hapi-mongo-rest-api.git`.
5. Run `cd hapi-mongo-rest-api`.
6. Run `npm install`.
7. Run `npm start`.
8. Use Postman to make requests.

## API

### Users

#### Get all users

```
GET /users
```

#### Get single user

```
GET /users/:id
```

#### Create user

Format: { firstName: *string*, lastName: *string*, age: *number* }  
firstName and lastName is required and age must be a positive value.

```
POST /users
```

#### Update user

Format: { firstName: *string*, lastName: *string*, age: *number* }

```
PUT /users/:id
PATCH /users/:id
```

#### Remove user

```
DELETE /users/:id
```

## Tests

Run `npm test` to see unit and end to end testing.
