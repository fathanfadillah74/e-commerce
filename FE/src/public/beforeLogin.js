const api = 'http://localhost:3200'

document.addEventListener('DOMContentLoaded', function () {
    try {
        const token = localStorage.getItem("token")
        const path = window.location.pathname
        if (token && path === "/login") {
            window.location.href = '/'
        }
        if (!token && path === "/") {
            window.location.href = '/login'
        }
    } catch (error) {
        console.log(error)
    }
    try {
        const btn = document.getElementById('btn_login')

        btn.onclick = async (e) => {
            e.preventDefault()

            const data = {
                email: e.target.form[0].value,
                password: e.target.form[1].value

            }
            const response = await fetch(api + '/users/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            if (result.ResultCode === 1) {
                document.cookie = `token` + `=` + `${result.data}`
                localStorage.setItem("token", result.data)
                window.location.href = "/"
            }
        }

    } catch (error) {
        console.log(error)
    }
    try {
        const btn = document.getElementById('btn_register')
        const path = window.location.pathname

        btn.onclick = async (e) => {
            e.preventDefault()

            if (path === '/login') {
                window.location.href = '/register'
            }
            else {
                const data = {
                    email: e.target.form[0].value,
                    password: e.target.form[1].value

                }
                const response = await fetch(api + '/users/create', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                })
                const result = await response.json()
                if (result.ResultCode === 1) {
                    window.location.href = '/login'
                }
            }
        }

    } catch (error) {
        console.log(error)
    }

})