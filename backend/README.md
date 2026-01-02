## Setup

- Install deps: `npm install`
- Start in dev mode: `npm run dev` (uses `ts-node-dev`)
- Build: `npm run build` and then `npm start`

## Migrations & Seeds

This project includes Sequelize CLI configuration, a migration to create the `users` table and a seed file that inserts a demo user.

Run after installing dependencies:

- Run migrations to up: `npm run migrate:up`
- To undo last migration: `npm run migrate:down`
- To generate migration file: `npm run migrate:generate`


To unit test cases 
- Run command:  `npm run test`