import config from '../config/config';
import { Sequelize } from 'sequelize-typescript';
import { UsersModel } from '../models/user.model';
import { ipAddressModel } from '../models/ipAddress.model';
import { LoginLog } from '../models/loginLog.model';

const { database, username, password, port, host, dialect } =
  config.databases.mysql;
export const sequelize = new Sequelize(database, username, password, {
  dialect: dialect as any,
  host,
  port,
  logging: false,
});

// Register models with sequelize-typescript so `sequelize.sync()` picks them up
sequelize.addModels([UsersModel, ipAddressModel, LoginLog]);

sequelize
  .authenticate()
  .then(() => {
    console.log('MYSQL Connection has been established successfully.');
  })
  .catch(error => {
    console.log('Unable to connect to the database: ', error);
  });
