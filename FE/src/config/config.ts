export const oprConfigApp = {
    DefaultLanguage: 'en-US',
    Port: 2000,
    AppID: process.env.BEFastify || 'BE-Fastify',
    DataBase: process.env.DATABASE || "postgresql://postgres:kenari01@localhost:5432/ecommerce?schema=public",
    API: {
        baseUrl : "http://localhost:3200",
        //user start
        createUsers: "/users/create",
        loginUsers: "/users/login",
        updateUsers: "/users/update",
        //user end

        //product start
        getAllProduct: "/product/getAllProduct",
        createProduct: "/product/createProduct",
        updateProduct: "/product/updateProduct/:id",
        deleteProduct: "/product/deleteProduct/:id",
        //product end

        //balance start
        getBalance: "/balance/getBalance",
        historyBalance: "/balance/historyBalance",
        topupBalance: "/balance/topupBalance",
        //balance end

        //transaction start
        transferBalance: "/transaction/transferBalance",
        orderProduct: "/transaction/orderProduct",
        historyOrder: "/transaction/historyOrder"
        //transaction end

    }
}