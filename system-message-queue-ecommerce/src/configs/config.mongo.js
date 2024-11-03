const dev = {
  app: {
    port: 5001,
  },
  db: {
    host: process.env.DEV_APP_HOST || "localhost",
    port: process.env.DEV_APP_PORT || 27017,
    user: process.env.DEV_APP_USER || "",
    password: process.env.DEV_APP_PASSWORD || "",
    dbName: process.env.DEV_APP_DB_NAME || "",
  },
};

const prod = {
  app: {
    port: 5001,
  },
  db: {
    host: "localhost",
    port: 27019,
    user: "root",
    password: "123456",
  },
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
// console.log(config[env], env);
module.exports = config[env];
