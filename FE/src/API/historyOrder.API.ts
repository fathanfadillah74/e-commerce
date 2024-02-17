import { FastifyRequest } from "fastify";
import { oprConfigApp } from "../config/config";

export const historyOrderAPI = async (req: FastifyRequest) => {
    try {
        const token = req.cookies?.token;
        let opt = await fetch(oprConfigApp.API.baseUrl + oprConfigApp.API.historyOrder, {
            method: "GET",
            headers: {
                "content-Type": "application/json",
                "Authorization": `bearer ${token}`
            },
        })
        return opt.json();
    } catch (error) {
        console.log(error)
    }

}

export async function getHistoryOrder(req: FastifyRequest) {
    const data = await historyOrderAPI(req)
    return data
}