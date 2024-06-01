const http = require('http');
const env = require('dotenv');


async function getDataFromAPI(type){
    const auth = env.ACCESS_TOKEN;
    const options = {
        hostname: '20.244.56.144',
        path: `/test/${type}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication': `${auth}`
        }
    };

    let data = [];
    const req = http.request(options, (res)=>{
        res.setEncoding('utf-8');
        res.on('data', (chunk) => {
            data 
        })
    })
}

