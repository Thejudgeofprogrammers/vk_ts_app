export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'root',
        name: process.env.DB_NAME || 'test',
    },
    secret_salt: process.env.SECRET_SALT || 'testword',
});
