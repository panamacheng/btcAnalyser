var config = {
    server: {
        httpPort: 8080
    },
    // mysql: {
    //     host: 'block-reducer-server.mysql.database.azure.com',
    //     user: 'blockadmin@block-reducer-server',
    //     password: '1:1234btc',
    //     database: 'blockreducerdb',
    //     port: 3306,
    //     ssl: {
    //         rejectUnauthorized: false
    //     }
    // },
    mysql: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'blockreducerdb',
        port: 3306        
    },
    session: {
       secret: 'rango941001top@@'
    },
    bitmex: {
        testnet: false,
        apiKeyID: '',
        apiKeySecret: '',
        maxTableLen: 100,
        strUrl: 'https://www.bitmex.com/api/v1/trade/bucketed?binSize=5m&partial=false&symbol=XBTUSD&count=500&reverse=false&startTime='
    },
    client: {
    url: 'http://localhost:8080/api'
        //url: 'https://blockreducerwebapp.azurewebsites.net/api'
    }
};

module.exports = config;