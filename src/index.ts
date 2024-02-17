import fastify from 'fastify'
import { oprConfigApp } from './config/config'
import fastifypostgres from '@fastify/postgres'
import { routeHandler } from './route/route'
import jwt from '@fastify/jwt'
import handleCors from './cors/cors'
import cors from '@fastify/cors'

const server = fastify({ logger: true })

server.register(fastifypostgres, {
    connectionString: oprConfigApp.DataBase
})

server.register(jwt,{
    secret: 'secretKey'
})

server.register(cors, handleCors)

server.register(routeHandler)

server.listen({ port: oprConfigApp.Port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})