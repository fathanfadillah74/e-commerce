import { FastifyInstance } from "fastify";
import { eta } from "..";
import { getProduct } from "../API/product.API";
import { getHistoryOrder } from "../API/historyOrder.API";


export default async function routes(fastify: FastifyInstance) {
    fastify.get('/login', async (request: any, reply: any) => {
        const data = {
        }
        const res = eta.render('/login.html', data)
        reply.type('text/html').send(res)
    })
    fastify.get('/register', async (request: any, reply: any) => {
        const data = {
        }
        const res = eta.render('/register.html', data)
        reply.type('text/html').send(res)
    })
    fastify.get('/historyOrder', async (request: any, reply: any) => {
        const historyOrderData = await getHistoryOrder(request);
        const data = {
            historyOrderData: historyOrderData
        }
        const res = eta.render('/historyOrder.html', data)
        reply.type('text/html').send(res)
    })
    fastify.get('/', async (request: any, reply: any) => {
        try {
            const productData = await getProduct();
            const data = {
                productData: productData
            };
            const res = eta.render('/home.html', data);
            reply.type('text/html').send(res);
        } catch (error) {
            console.error("Error while rendering template:", error);
            reply.code(500).send('Internal Server Error');
        }
    });


}