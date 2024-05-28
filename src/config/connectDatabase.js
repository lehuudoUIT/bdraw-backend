const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('rainy_words_adventure', 'root', null, {
    host: 'localhost',
    dialect: 'mysql'
});

let connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = connectDatabase;