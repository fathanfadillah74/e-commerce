import { jwtDecode } from "jwt-decode"
import { core } from "../core/core"
import moment from "moment"
import { v4 as uuidv4 } from 'uuid';

export default class balanceController {
    static async balanceTopup(req: any, res: any, fastify: any) {
        try {
            const tableUsers = "users"
            const tableHistory = "balance_history"
            //input token to header and get with split(' ')[1]
            const reqAuthHeader = req.headers.authorization
            const token = reqAuthHeader.split(' ')[1]
            const { amount } = req.body
            const date = moment().format('DD-MM-YY HH:mm:ss')
            const id = uuidv4()
            //check token
            if (token == null) {
                fastify.jwt.verify(token, 'secretKey', () => {
                    return res.code(400).send({ ResultCode: 0, message: "token invalid" })
                })
            }
            //check amount minimum is 20.000
            if (!amount || amount < 19000) {
                fastify.jwt.verify(token, 'secretKey', () => {
                    return res.code(400).send({ ResultCode: 0, message: "minimum topup 20.000" })
                })
            }
            //get userId from token
            const userAccount: any = jwtDecode(token)
            const userId = userAccount.id

            //getData from Database
            const getOldData = await core.select(fastify, tableUsers, ["email", "balance"], "id", userId)
            const dataUserOld = await core.getRowsData(getOldData)

            //calculate balance form database + amount form req.body
            const newBalance = dataUserOld.balance + amount

            //update the user balance data
            await core.update(fastify, tableUsers, ["balance"], "id", [newBalance, userId])

            //get data after update
            const getNewData = await core.select(fastify, tableUsers, ["email", "balance"], "id", userId)
            const newData = await core.getRowsData(getNewData)

            await core.insert(fastify, tableHistory, ["id", "user_email", "balance", "status", "date"], [id, newData.email, `+${amount}`, `Topup`, date])

            return res.code(200).send({ ResultCode: 1, data: newData, message: `topup ${amount} succes` })

        } catch (error: any) {
            res.code(404).send({ ResultCode: 0, message: error.message })
        }
    }
    static async historyBalance(req: any, res: any, fastify: any) {
        try {
            const tableHistory = "balance_history"
            const tableUsers = "users"
            const reqAuthHeader = req.headers.authorization
            const token = reqAuthHeader.split(' ')[1]

            if (token == null) {
                fastify.jwt.verify(token, 'secretKey', () => {
                    return res.code(400).send({ ResultCode: 0, message: "token invalid" })
                })
            }
            const userAccount: any = jwtDecode(token)
            const userId = userAccount.id
            const getDataUser = await core.select(fastify, tableUsers, ["*"], "id", userId)
            const dataUser = await core.getRowsData(getDataUser)

            const getHistoryBalance = await core.select(fastify, tableHistory, ["*"], "user_email", dataUser.email)
            if (getHistoryBalance.rows.length == 0) {
                return res.code(404).send({ ResultCode: 0, message: "You haven't made any transactions yet" })
            }
            return res.code(200).send({ ResultCode: 1, data: getHistoryBalance.rows })

        } catch (error: any) {
            res.code(404).send({ ResultCode: 0, message: error.message })
        }

    }
}