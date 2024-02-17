import { FastifyReply, FastifyRequest } from "fastify"
import { oprConfigApp } from "../config/config"
import authController from "../controller/auth.controller"
import balanceController from "../controller/balance.controller"
import productController from "../controller/product.controller"
import transactionController from "../controller/transaction.controller"

export const routeHandler = async (fastify: any) => {
    //user config start
    fastify.post(oprConfigApp.API.createUsers, (req: FastifyRequest, res: FastifyReply) => { authController.registerUser(req, res, fastify) })
    fastify.post(oprConfigApp.API.loginUsers, (req: FastifyRequest, res: FastifyReply) => { authController.login(req, res, fastify) })
    fastify.post(oprConfigApp.API.updateUsers, (req: FastifyRequest, res: FastifyReply) => { authController.updateUserAccount(req, res, fastify) })
    //user config end

    //user transaction start
    fastify.post(oprConfigApp.API.topupBalance, (req: FastifyRequest, res: FastifyReply) => { balanceController.balanceTopup(req, res, fastify) })
    fastify.post(oprConfigApp.API.orderProduct, (req: FastifyRequest, res: FastifyReply) => { transactionController.orderProduct(req, res, fastify) })
    //user transaction end

    //product start
    fastify.post(oprConfigApp.API.createProduct, (req: FastifyRequest, res: FastifyReply) => { productController.createProduct(req, res, fastify) })
    fastify.get(oprConfigApp.API.getAllProduct, (req: FastifyRequest, res: FastifyReply) => { productController.getProduct(req, res, fastify) })
    //product end

    //history start
    fastify.get(oprConfigApp.API.historyOrder, (req: FastifyRequest, res: FastifyReply) => { transactionController.historyOrder(req, res, fastify) })
    fastify.get(oprConfigApp.API.historyBalance, (req: FastifyRequest, res: FastifyReply) => { balanceController.historyBalance(req, res, fastify) })
    //history end
}