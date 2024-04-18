// Budget API

const express = require('express');
const cors = require('cors');
const app = express();
const budgetData = require("./budgetData.json");
const port = 3001;

app.use(cors());

app.get('/budget', (req, res) => {
    res.json(budgetData);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});