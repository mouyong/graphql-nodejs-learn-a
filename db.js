import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const Coon = new Sequelize(
    'demo',
    'homestead',
    'secret',
    {
        dialect: 'mysql',
        host: 'localhost',
        port: 33060,
    }
);

const Person = Coon.define('person', {
    first_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
}, {
    underscored: true,
});

const Post = Coon.define('post', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    underscored: true,
});

// Relationships
Person.hasMany(Post)
Post.belongsTo(Person)

Coon.sync({force: true}).then(() => {
    _.times(10, () => {
        return Person.create({
            first_name: Faker.name.firstName(),
            last_name: Faker.name.lastName(),
            email: Faker.internet.email()
        }).then(person => {
            return person.createPost({
                title: `sample title by ${person.first_name}`,
                content: `this is a sample article`
            });
        });
    });
});

export default Coon;