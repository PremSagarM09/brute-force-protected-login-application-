const { config } = require("dotenv");
config();

module.exports = {
    host: process.env.MYSQL_HOST || "localhost",
    username: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_DB || "test",
    port: (process.env.MYSQL_PORT) || 3306,
    dialect: (process.env.DIALECT) || "mysql",
}