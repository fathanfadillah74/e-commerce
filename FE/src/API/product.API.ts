import { oprConfigApp } from "../config/config"

export const productAPI = async () => {
    let opt = await fetch(oprConfigApp.API.baseUrl + oprConfigApp.API.getAllProduct, {
        method: "GET",
        headers: {
            "content-Type": "application/json",
        },
    })
    return opt.json();
}

export async function getProduct() {
    try {
        let data = [];
        const productTable = await productAPI()
        const oldData = productTable.data
        if (productTable.ResultCode == 1) {
            for (let i = 0; i < oldData.length; i++) {
                data.push(oldData[i])
            }
        }
        return data
    } catch (error) {
        console.log(error)
    }
}