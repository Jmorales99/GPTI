// models/job.js
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      company: {
        type: DataTypes.STRING,

      },
      city: {
        type: DataTypes.STRING,

      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      link: {
        type: DataTypes.TEXT,

      },
    });
  
    return Job;
  };
  