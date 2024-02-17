import fastify, { FastifyInstance } from 'fastify';
import routes from './route/route';
import { Eta } from "eta";
import path from 'path';
import { oprConfigApp } from './config/config';
import fastifyStatic from '@fastify/static';
import cookie, { FastifyCookieOptions } from '@fastify/cookie'

const server: FastifyInstance = fastify({
    logger: true
});

const STATIC_FILE_MAX_AGE = 31557600000
const staticPaths = [path.join(__dirname, 'public'), path.join(__dirname, 'public_assets')]

server.register(fastifyStatic, {
  root: staticPaths,
  maxAge: STATIC_FILE_MAX_AGE
})

export const eta = new Eta({ views: path.join(__dirname, "layout") });


server.register(routes);

server.register(cookie, {
    secret: "my-secret", // for cookies signature
    parseOptions: {}     // options for parsing cookies
  } as FastifyCookieOptions)

server.listen({ port: oprConfigApp.Port }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});