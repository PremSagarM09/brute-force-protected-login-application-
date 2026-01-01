import dotenv from 'dotenv';
const envFound = dotenv.config({ path: '.env' });
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const environment: any = {
  port: process.env['PORT'] || '3000',
  databases: {
    mysql: {
      host: process.env['MYSQL_HOST'] || 'localhost',
      username: process.env['MYSQL_USER'] || 'root',
      password: process.env['MYSQL_PASSWORD'] || 'root',
      database: process.env['MYSQL_DB'] || 'test',
      port: (process.env['MYSQL_PORT'] as unknown as number) || 3306,
      dialect: process.env['DIALECT'] || 'mysql',
    },
  },
  jwtSecret: process.env['JWT_SECRET'],
  jwtAccessExpiry: process.env['JWT_ACCESS_EXPIRY'] || '24h',
  jwtRefreshExpiry: process.env['JWT_REFRESH_EXPIRY'] || '30d',
  projectName: process.env['PROJECT_NAME'],
  timeZone: 'Asia/Kolkata',
  timeZoneValue: '+05:30',
};

export default environment;
