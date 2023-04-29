import * as fs from 'fs';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from 'apollo-server-core';
import http from 'http';

import {resolvers} from './resolvers';

const typeDefs = fs.readFileSync("./schema.graphql", "utf8").toString();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        ApolloServerPluginDrainHttpServer({
            httpServer,
        }),
        ApolloServerPluginLandingPageLocalDefault(
            {
                embed: true,
            }),
    ],
});

async function startApolloServer() {
    await server.start();
    const clientPort = process.env.CLIENT_PORT || 3000;
    server.applyMiddleware({
        app,
        cors:
            {
                origin: [`http://localhost:${clientPort}`]
            },
    });
}

startApolloServer().then(() => {
    const serverPort = process.env.SERVER_PORT || 3003;
    app.listen(serverPort, () => {
        console.log(`🚀 Server is running at http://localhost:${serverPort}${server.graphqlPath}`);
    });
});
