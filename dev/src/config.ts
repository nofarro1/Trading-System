
const env = process.env.NODE_ENV.trim();
console.log("running in environment: " + env)

const defaultAdminCredentials = {
    username: "admin",
    password: ""
}
const dev = {
    env: "dev",
    app: {
        port: 3000,
        external_services_config: {
            min:1000,
            max: 10000,
            url: ""
        }

    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: parseInt(process.env.DEV_DB_PORT) || 5432,
        name: process.env.DEV_DB_NAME || 'devDB',
        apiKey: "some-api-key"
    }
};

const prod = {
    env: "prod",
    app: {
        port: 3000,
        external_services_config: {
            min:10000,
            max: 10000,
            url: "https://cs-bgu-wsep.herokuapp.com/"
        }
    },
    db: {
        host: process.env.DEV_DB_HOST || 'some-url',
        port: parseInt(process.env.DEV_DB_PORT) || 5432,
        name: process.env.DEV_DB_NAME || 'prodDB',
        apiKey: "some-api-key"
    }
};

const configs = {
    dev,
    prod
}

const config = env === "dev" ? configs.dev : configs.prod ;
export default  config;