
# Full Stack JavaScript Techdegree v2 - REST API Project

This is a REST API that creates, gets, updates, and deletes users and courses through an API.

Requests are process through a Node server using Express. Each request is routed appropriately to retrieve or manipulate the data as necessary.

Sequelize ORM was used to connect the API to a SQLite database. Sequelzize models were created to set the tables for users and courses, validate new submissions, and hash user passwords upon submission.

A Postman collection is provided to test calls to the API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Create and seed data in the database.

```
npm run seed
```

To start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
