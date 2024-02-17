const handleCors = () => {
    return (req: any, callback: any) => {
        const corsOptions = {
            origin: true,
            Content: true
        };

        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
            corsOptions.Content = false
        }
        callback(null, corsOptions)
    }
}

export default handleCors;