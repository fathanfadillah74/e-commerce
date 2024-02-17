import { jwtDecode } from "jwt-decode"
import { core } from "../core/core"
import moment from "moment"
import { v4 as uuidv4 } from 'uuid';

export default class transactionController {
    static async orderProduct(req: any, res: any, fastify: any) {
        try {
            const productTable = "product"
            const usersTable = "users"
            const historyOrderTable = "transaction_history"
            const historyBalanceTable = "balance_history"

            const reqAuthHeader = req.headers.authorization
            const token = reqAuthHeader.split(' ')[1]
            const { name, quantity } = req.body
            const date = moment().format('DD-MM-YY HH:mm:ss')
            const id = uuidv4()

            if (token == null) {
                return res.code(401).send({ ResultCode: 0, message: "invalid token" })
            }
            const userAccount: any = await jwtDecode(token)
            const userId = userAccount.id

            //get data from product table
            const selectProduct = await core.select(fastify, productTable, ["*"], "name", name)
            const productData = await core.getRowsData(selectProduct)
            const stockProduct = productData.stock
            const productName = productData.name
            const productId = productData.id
            const totalprice = productData.price * quantity
            const finalStock = productData.stock - quantity

            //get data from user table
            const selectUser = await core.select(fastify, usersTable, ["balance"], "id", userId)
            const userData = await core.getRowsData(selectUser)
            const balanceUser = userData.balance
            const finalBalance = balanceUser - totalprice

            if (quantity == 0) {
                return res.code(301).send({ ResultCode: 0, message: "quantity cant be 0" })
            }

            if (stockProduct < quantity) {
                return res.code(301).send({ ResultCode: 0, message: "stock not available" })
            }

            if (totalprice > balanceUser) {
                return res.code(301).send({ ResultCode: 0, message: "balance low, please topup balance first" })
            }

            //update all table
            await core.update(fastify, productTable, ["stock"], "id", [finalStock, productId])
            await core.update(fastify, usersTable, ["balance"], "id", [finalBalance, userId])

            //get new data from all table
            const selectUserNew = await core.select(fastify, usersTable, ["email", "balance"], "id", userId)
            const userDataNew = await core.getRowsData(selectUserNew)

            await core.insert(fastify, historyOrderTable, ["id", "user_email", "product_name", "order_price", "order_date"], [id, userDataNew.email, productData.name, totalprice, date])
            await core.insert(fastify, historyBalanceTable, ["id", "user_email", "balance", "status", "date"], [id, userDataNew.email, `-${totalprice}`, "order product", date])

            return res.code(200).send({ ResultCode: 1, data: userDataNew, message: `order ${productName} succes` })

        } catch (error: any) {
            return res.code(404).send({ ResultCode: 0, message: error.message })
        }
    }
    static async historyOrder(req: any, res: any, fastify: any) {
        try {
            const tableUsers = "users"
            const tableHistory = "transaction_history"
            const reqAuthHeader = req.headers.authorization
            const token = reqAuthHeader.split(" ")[1]

            if (token == null) {
                return res.code(401).send({ ResultCode: 0,message: "invalid token" })
            }
            const userAccount: any = await jwtDecode(token)
            const userId = userAccount.id

            const getDataUser = await core.select(fastify, tableUsers, ["*"], "id", userId)
            const dataUser = await core.getRowsData(getDataUser)

            const getDataHistory = await core.select(fastify, tableHistory, ["*"], "user_email", dataUser.email)
            if (getDataHistory.rows.length == 0) {
                return res.code(404).send({ResultCode: 0, message: "You haven't made any transactions yet" })
            }
            return res.code(200).send({ ResultCode: 1,data: getDataHistory.rows })

        } catch (error: any) {
            return res.code(404).send({ ResultCode: 0,message: error.message })
        }

    }
}