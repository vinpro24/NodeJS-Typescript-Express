# typescript-node [![Build Status](https://github.com/vinpro24/NodeJS-Typescript-Express)](https://github.com/vinpro24/NodeJS-Typescript-Express) [![vinpro](https://static.wixstatic.com/media/d84663_5ce0f9a5ac934e3d8abeffda952a776c~mv2.png)](https://codecov.io/gh/Talento90/typescript-node) [![VinPro](https://api.codacy.com/project/badge/Grade/7e1b73f83bf7485c9d75e8ea9f853d36)](https://www.codacy.com/app/Talento90/typescript-node?utm_source=github.com&utm_medium=referral&utm_content=Talento90/typescript-node&utm_campaign=Badge_Grade)

# [NodeJS Typescript Express](https://github.com/vinpro24/NodeJS-Typescript-Express) [![Github](https://static.wixstatic.com/media/d84663_5ce0f9a5ac934e3d8abeffda952a776c~mv2.png)](https://github.com/vinpro24)

![version](https://img.shields.io/badge/version-2.1.0-blue.svg)
[![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/material-dashboard-react.svg)](https://github.com/vinpro24/NodeJS-Typescript-Express/issues?q=is%3Aopen+is%3Aissue)
[![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/material-dashboard-react.svg)](https://github.com/vinpro24/NodeJS-Typescript-Express/issues?q=is%3Aissue+is%3Aclosed)

Template for building NodeJS, Typescript and ExpressJS services. The main goal of this boilerplate is to offer a good Developer Experience (eg: debugging, watch and recompile) by providing the
following features out of the box:

**_Features_**

-   Language - [TypeScript](https://www.typescriptlang.org/)
-   REST API - [ExpressJS](https://expressjs.com/)
-   Graceful Shutdown - [Pattern](https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html)
-   HealthCheck - [Pattern /health](http://microservices.io/patterns/observability/health-check-api.html)
-   MongoDB Database - [Mongoose](https://mongoosejs.com)
-   Authentication and Authorization - [JWT](https://github.com/auth0/node-jsonwebtoken)
-   Validation - [Joi](https://github.com/hapijs/joi)
-   Testing - [Jest](https://jestjs.io) [Supertest](https://github.com/ladjs/supertest) [Coverage](https://istanbul.js.org/)
-   Code Style - [Prettier](https://prettier.io/)
-   Git Hooks - [Husky](https://github.com/typicode/husky)

## Installation & Run

-   _npm install_ - Install dependencies
-   _npm run start_ - Start application (It needs a database)

### Running with Docker

-   _docker-compose up_ (compose and run, it also creates the database)
-   _docker-compose down_ (Destroy application and containers)

## Useful npm commands

-   _npm run build_ - Transpile TypeScript code
-   _npm run clean_ - Remove dist
-   _npm run dev_ - Run application in dev mode (debug & watch). Debug mode is running on port 3000 (open `chrome://inspect/#devices`).
-   _npm run test:ci_ - Run unit tests
-   _npm run test_ - Run Unit and rerun Jest tests when a file changes
