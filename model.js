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
var sequelize;
if(process.env.NODE_ENVIRONMENT === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    sequelize = new Sequelize(null, null, null, {
        dialect: 'sqlite',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },

        storage: storage
    });

}

var User = sequelize.define('User', {
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
var Note = sequelize.define('Note', {
    theme: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [4, 100]
        }
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [10, 140]
        }
    },
    UserId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
User.hasMany(Note);
Note.belongsTo(User);

module.exports = {
    User: User,
    Note: Note
};