import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import express from 'express';
import resolvers from './resolvers';
import typeDefs from './schemas';

const server = new ApolloServer({
    debug: false,
    typeDefs: typeDefs,
    resolvers: resolvers
})

const app = express();
app.use(bodyParser.json());
server.applyMiddleware({app});
app.listen({port: process.env.PORT || 4000}, () => console.log(`Server is Runnig.. http://localhost:4000${server.graphqlPath}`))