import bcrypt from "bcrypt"
import { v4 as uuidv4 } from 'uuid';
import { core } from "../core/core";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

export default class authController {
    static async registerUser(req: any, res: any, fastify: any) {
        try {
            const table = "users"
            const { email, password } = req.body
            const id = uuidv4()
            const hashPassword = await bcrypt.hash(password, 12)
            const joinDate = moment().format('DD-MM-YY HH:mm:ss')
            if (!email || !password) {
                return res.code(301).send({ ResultCode: 0, message: "you must fill email and password" })
            }
            if (!email.includes("@")) {
                return res.code(301).send({ ResultCode: 0, message: "input the correct email" })
            }
            const username = email.split('@')[0]
            const userNow = await core.select(fastify, table, ["email"], "email", email)
            if (userNow.rowCount >= 1) {
                return res.code(301).send({ ResultCode: 0, message: "email already used, please choose different email" })
            }
            await core.insert(fastify, table, ["id", "email", "password", "balance", "username", "join_date"], [id, email, hashPassword, 0, username, joinDate])
            const insertedUserQuery2 = await core.select(fastify, table, ["username", "email", "balance"], "id", id)
            const insertedUser = await core.getRowsData(insertedUserQuery2)
            return res.code(200).send({ ResultCode: 1, data: insertedUser, message: "Data has been create" })
        } catch (error: any) {
            res.code(404).send({ ResultCode: 0, message: error.message })
        }
    }

    static async login(req: any, res: any, fastify: any) {
        try {
            const table = "users"
            const { email, password } = req.body
            let user;
            if (!email.includes("@")) {
                user = await core.select(fastify, table, ["id", "username", "email", "password"], "username", email)
            }
            else {
                user = await core.select(fastify, table, ["id", "username", "email", "password"], "email", email)
            }

            if (user.rowCount == 0) {
                return res.code(401).send({ ResultCode: 0, message: "user not found" })
            }
            const data = await core.getRowsData(user)
            const compare = await bcrypt.compare(password, data.password)
            if (!compare) {
                return res.code(400).send({ ResultCode: 0, message: "email or password incorrect" })
            }
            const payload = {
                id: data.id,
                username: data.username,
                email: data.email,
                password: data.password
            }

            return fastify.jwt.sign(payload, 'secretKey', (error: any, token: any) => {
                if (error) {
                    console.log(error);
                }
                res.code(200).send({ data: token, ResultCode: 1 })
            })

        } catch (error: any) {
            res.code(404).send({ ResultCode: 0, message: error.message })
        }
    }

    static async updateUserAccount(req: any, res: any, fastify: any) {
        try {
            const table = "users"
            //req headers for user and then split to get token
            const reqAuthHeader = req.headers.authorization
            const token = reqAuthHeader.split(" ")[1]

            //condition if token null
            if (token == null) {
                fastify.jwt.verify(token, 'secretKey', () => {
                    return res.code(400).send({ ResultCode: 0, message: "token invalid" })
                })
            }

            //get userId from token
            const userAccount: any = jwtDecode(token)
            const userId = userAccount.id

            //get data old user from table
            const getOldDataUser = await core.select(fastify, table, ["*"], "id", userId)
            const oldDataUser = await core.getRowsData(getOldDataUser)

            //request body for user
            const { username = oldDataUser.username, email = oldDataUser.email, password = oldDataUser.password } = req.body
            //compare pass and check form last password
            const compare = await bcrypt.compare(password, oldDataUser.password)
            if (compare) {
                return res.code(301).send({ ResultCode: 0, message: "please dont use your last password" })
            }
            //hash pasword using bcrypt
            if (password != oldDataUser.password) {
                const hashPassword = await bcrypt.hash(password, 12)

                await core.update(fastify, table, ["username", "email", "password"], "id", [username, email, hashPassword, userId])

                const getNewDataUser = await core.select(fastify, table, ["username", "email", "password"], "id", userId)
                const newDataUser = await core.getRowsData(getNewDataUser)

                return res.code(200).send({ ResultCode: 1, data: newDataUser, message: "update data success" })
            }
            else {
                //update Password
                await core.update(fastify, table, ["username", "email", "password"], "id", [username, email, password, userId])
                //get data new user from table
                const getNewDataUser = await core.select(fastify, table, ["username", "email", "password"], "id", userId)
                const newDataUser = await core.getRowsData(getNewDataUser)
                return res.code(200).send({ ResultCode: 1, data: newDataUser, message: "update data success" })
            }

        } catch (error: any) {
            res.code(404).send({ ResultCode: 0, message: error.message })
        }
    }
}