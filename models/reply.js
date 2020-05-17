"use strict";
module.exports = (sequelize, DataTypes) => {
  const reply = sequelize.define("reply", {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  reply.associate = function (models) {
    reply.belongsTo(models.post, {
      foreignKey: "postId",
    });
  };

  return reply;
};
