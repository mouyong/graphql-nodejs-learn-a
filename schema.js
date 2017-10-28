import {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLSchema,
    GraphQLNonNull
} from 'graphql';
import Db from './db';

const Person = new GraphQLObjectType({
    name: 'Person',
    description: 'This represents a Person',
    fields(){
        return {
            id: {
                type: GraphQLInt,
                resolve(person) {
                    return person.id;
                }
            },
            first_name: {
                type: GraphQLString,
                resolve(person) {
                    return person.first_name;
                }
            },
            last_name: {
                type: GraphQLString,
                resolve(person) {
                    return person.last_name;
                }
            },

            fullname: {
                type: GraphQLString,
                resolve(person) {
                    return `${person.first_name} ${person.last_name}`;
                }
            },
            email: {
                type: GraphQLString,
                resolve(person) {
                    return person.email;
                }
            },
            posts: {
                type: new GraphQLList(Post),
                resolve(person) {
                    return person.getPosts();
                }
            }
        }
    }
});

const Post = new GraphQLObjectType({
    name: 'Post',
    description: 'this is a post by one person',
    fields() {
        return {
            id: {
                type: GraphQLInt,
                resolve(post) {
                    return post.id;
                }
            },
            title: {
                type: GraphQLString,
                resolve(post) {
                    return post.title;
                }
            },
            content: {
                type: GraphQLString,
                resolve(post) {
                    return post.content;
                }
            },
            author: {
                type: Person,
                resolve(post) {
                    return post.getPerson();
                }
            }
        }
    }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    description: 'this is root query',
    fields() {
        return {
            person: {
                type: new GraphQLList(Person),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    email: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return Db.models.person.findAll({where: args});
                }
            },
            posts: {
                type: new GraphQLList(Post),
                args: {
                    id: {
                        type: GraphQLInt
                    },
                    title: {
                        type: GraphQLString
                    }
                },
                resolve(root, args) {
                    return Db.models.post.findAll({where: args});
                }
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    description: 'this is root mutation',
    fields() {
        return {
            createPeople: {
                type: Person,
                args: {
                    first_name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    last_name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(_, args) {
                    return Db.models.person.create({
                        first_name: args.first_name,
                        last_name: args.last_name,
                        email: args.email
                    });
                }
            }
        }
    }
});
const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
});

export default Schema;