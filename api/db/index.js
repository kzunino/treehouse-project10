const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  logging: false
// Global options to adjust models
  // define: {
  //   freezeTableName: true,
  //   timestamps: false,
  // }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

const db = {
  sequelize,
  Sequelize,
  models: {},
};

//imports new model
db.models.User = require('./models/User.js')(sequelize);
db.models.Course = require('./models/Course.js')(sequelize);



// Import all of the models.
fs
  .readdirSync(path.join(__dirname, 'models'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'models', file));
    db.models[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(db.models).forEach((modelName) => {
  if (db.models[modelName].associate) {
    console.info(`Configuring the associations for the ${modelName} model...`);
    db.models[modelName].associate(db.models);
  }
});


module.exports = db;
