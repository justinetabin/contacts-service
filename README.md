# Contacts REST API
[![Build Status](https://travis-ci.com/justinetabin/contacts-service.svg?branch=master)](https://travis-ci.com/justinetabin/contacts-service)
[![codecov](https://codecov.io/gh/justinetabin/contacts-service/branch/master/graph/badge.svg)](https://codecov.io/gh/justinetabin/contacts-service)
[![Heroku](https://heroku-badge.herokuapp.com/?app=heroku-badge&svg=1)](https://contacts-service.herokuapp.com/documentation)


A barebone Node.JS CRUD application.

# Architecture Overview
This project's architecture highlights separation of concerns and dividing software into layers.

### Service Layer
- Encapsulates the interaction between 3rd party service or API. 

### Worker Layer
- Encapsulates the complex business or presentation logic and make them reusable.

### Interface Layer
- The UI and/or API that can be easily added or swapped in and out without changing any business logic.

# Requirements
- NPM / Node.js 13
- MongoDB
- Docker / Docker Compose

# Setup locally
Install npm packages.
```
$ npm install
```
Add environment-specific variables in `.env` file.
```
PORT=
HOST=
MONGODB_URI=
MONGODB_DB_NAME=
```

## Run the app
```
$ npm start
```

## Visit the Swagger documentation
```
http://{HOST}:{PORT}/documentation
```

# Setup docker
```
$ docker-compose up -d --build
```

# Run the tests
Runs all test.
```
$ npm test
```
`Routes`
```
$ npm run test:api
```
`Workers`
``` 
$ npm run test:workers
```
`Services`
```
$ npm run test:services
```
