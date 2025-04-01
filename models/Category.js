const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Category", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
