import { core } from "../core/core"
import { v4 as uuidv4 } from 'uuid';
import moment from "moment"

export default class productController {
    static async createProduct(req: any, res: any, fastify: any) {
        try {
            const table = "product"
            const { name, category, price, stock } = req.body
            const id = uuidv4()
            const date = moment().format('DD-MM-YY HH:mm:ss')

            const getDataOld = await core.select(fastify, table, ["*"], "name", name)
            if (getDataOld.rowCount >= 1) {
                const dataOld = await core.getRowsData(getDataOld)
                const finalStock = stock + dataOld.stock
                await core.update(fastify, table, ["price", "add_date", "stock"], "name", [price, date, finalStock, name])
                const data = await core.select(fastify, table, ["*"], "name", name)
                return res.code(200).send({ data: data.rows })
            } else {
                await core.insert(fastify, table, ["id", "name", "category", "price", "add_date", "stock"], [id, name, category, price, date, stock])
                const data = await core.select(fastify, table, ["*"], "id", id)
                return res.code(200).send({ data: data.rows })
            }
        } catch (error: any) {
            res.code(404).send({ message: error.message })
        }
    }
    static async getProduct(req: any, res: any, fastify: any) {
        try {
            const table = "product"
            const getTableProduct = await core.select(fastify, table, ["*"])
            return res.code(200).send({ data: getTableProduct.rows, ResultCode: 1 })
        } catch (error: any) {
            res.code(404).send({ message: error.message, ResultCode: 0 })
        }
    }
}