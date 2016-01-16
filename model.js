var Sequelize = require('sequelize');
var util = require('util');
var storage = '';
switch (process.env.NODE_ENVIRONMENT) {
    case 'production':
        storage = util.format('%s/db/production.sqlite', __dirname);
        break;
    case 'test':
        storage = util.format('%s/db/test.sqlite', __dirname);
        break;
    default:
        storage = util.format('%s/db/development.sqlite', __dirname);
        break;

}
var sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    storage: storage
});

var User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [4]
        }
    },
    password_digest: {
        type: Sequelize.STRING,
        allowNull: false
    },
    token_digest: {
        type: Sequelize.STRING
    }
});

module.exports = {
    User: User
};