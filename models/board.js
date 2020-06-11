"use strict";
module.exports = (sequelize, DataTypes) => {
  const board = sequelize.define("board", {
    festival_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scope: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING,
    },
  });
  board.associate = function (models) {
    // associations can be defined here
  };
  return board;
};
