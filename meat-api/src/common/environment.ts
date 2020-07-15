export const environment = {
    server: {
        port: process.env.SERVER_PORT || 3000
    },
    db: {
        url: process.env.DB_URL || 'localhost',
        name: process.env.DB_NAME || 'admin',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || ''
    }
}