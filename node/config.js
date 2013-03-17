module.exports = {
    mongodb: {
        server: 'localhost',
        port: 27017,

        //autoReconnect: automatically reconnect if connection is lost
        autoReconnect: true,
        //poolSize: size of connection pool (number of connections to use)
        poolSize: 4
    },
    site: {
        //baseUrl: the URL that mongo express will be located at
        //Remember to add the forward slash at the end!
        baseUrl: 'http://localhost:8081/',
        port: 8081,
        cookieSecret: 'cookiesecret',
        sessionSecret: 'sessionsecret'
    }
};
