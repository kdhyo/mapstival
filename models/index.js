"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// DB객체에 시퀄라이즈 객체를 sequelize 속성으로 바인딩한다.
db.sequelize = sequelize; //mysql db 관련 객체
db.Sequelize = Sequelize; // ORM 관련된 객체

db.User = require("./user")(sequelize, Sequelize);
db.Posr = require("./post")(sequelize, Sequelize);
db.Reply = require("./reply")(sequelize, Sequelize);
db.Board = require("./board")(sequelize, Sequelize);

module.exports = db;
