# tichete-server
Server for the tichete open source it ticketing system

### Current State / Change Log
Nov 26 2020 - v0.1.0
- Use NestJS framework with GraphQL API
Mar 28 2020 - v0.0.1
- Made repo public after rewrite and splitting client/server up.

### Dev Instructions
 - Install Yarn/NPM/Node, and MySQL
 - Clone this repo to your machine and cd into it
 - Copy the file .env.example to .env and customize
 - Create new database called 'tichete' (or change the name in the .env file)
 - Install the project: `yarn install`
 - Run the db migrations: `typeorm:migration:run`
 - Run the db production data seeder: `yarn seed:prod`
 - Start the server: `yarn start` (or `yarn start:dev` for file-watching)
 - Client will be running on localhost:3000 by default, and redirect to the graphql API browser.

### Todos
 - Result pagination for tickets/users
 - IT ticket addressing, responding, resolving, rejecting, commenting, etc

---
### License

GPLv3
