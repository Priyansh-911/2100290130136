const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
const TIMEOUT = 500;  // 500 milliseconds
const NUMBER_SERVER_URL = "http://20.244.56.144/test";  // replace with actual test server URL
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

let window = [];
let previousWindowState = [];

const fetchNumbers = async (numberType) => {
    try {
        const response = await axios.get(`${NUMBER_SERVER_URL}/${numberType}`, { timeout: TIMEOUT, headers:{
            'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });
        if (response.status === 200) {
            return response.data.numbers;
        } else {
            return [1,2,3,4];
        }
    } catch (error) {
        console.log(error);
    }
};

const updateWindow = (newNumbers) => {
    let currentWindowState = [...window];

    newNumbers.forEach(num => {
        if (!window.includes(num)) {
            if (window.length >= WINDOW_SIZE) {
                window.shift();  // Remove the oldest number
            }
            window.push(num);
        }
    });

    let updatedWindowState = [...window];
    let average = updatedWindowState.length > 0 ? updatedWindowState.reduce((acc, num) => acc + num, 0) / updatedWindowState.length : 0;

    let response = {
        "numbers": newNumbers,
        "windowPrevState": currentWindowState,
        "windowCurrState": updatedWindowState,
        "avg": average.toFixed(2)
    };

    previousWindowState = currentWindowState;
    return response;
};

app.get('/numbers/:numberType', async (req, res) => {
    const numberType = req.params.numberType;
    if (!['p', 'f', 'e', 'r'].includes(numberType)) {
        return res.status(400).json({ error: "Invalid number type" });
    }

    if(numberType === 'p') numberType === 'prime';
    if(numberType === 'e') numberType === 'even';
    if(numberType === 'f') numberType === 'fibonaci';
    if(numberType === 'r') numberType === 'random';


    const newNumbers = await fetchNumbers(numberType);
    const response = updateWindow(newNumbers);
    res.json(response);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});