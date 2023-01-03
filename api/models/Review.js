"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {}

  Review.init(
    {
      content: {
        type: DataTypes.STRING,
        validate: {
          len: [3, 1000],
          notEmpty: true,
        },
      },
      SongId: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Review",
    }
  );

  Review.associate = (models) => {
    // associations can be defined here
    Review.belongsTo(models.Song);
    Review.belongsTo(models.User);
  };

  return Review;
};
