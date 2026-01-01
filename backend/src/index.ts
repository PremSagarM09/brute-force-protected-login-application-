import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { sequelize } from './loaders/database';

const PORT = process.env.PORT || 3003;

const server = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synced');

    app.listen(PORT, () => {
      console.log(`
        ##############################################
        Server listening on http://localhost:${PORT}
        ##############################################`);
    }).on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    });
  } catch (err) {
    console.error('Unable to start server:', err);
    process.exit(1);
  }
}

server();