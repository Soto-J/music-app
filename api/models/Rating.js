const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {}

  Rating.init(
    {
      rating: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        validate: {
          min: 0,
          max: 10,
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
      modelName: "Rating",
    }
  );

  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.Song);
    Rating.belongsTo(models.User);
  };

  return Rating;
};
