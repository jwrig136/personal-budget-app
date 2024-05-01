// Expense API
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const fs = require("fs");
app.use(cors())
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
const secretKey = 'My super secret key';

app.post("/api/budget", (req, res) => {
   // console.log(req.body)
   const budgetData = req.body;
    res.send(req.body)
    fs.writeFileSync("./budgetData.json", JSON.stringify(budgetData));
})

app.get("/api/budget", (req, res) => {
    const budget = fs.readFileSync("./budgetData.json")
    res.send(budget)
})

app.post("/api/expenses", (req, res) => {
    const expensesData = req.body;
     res.send(req.body)
     fs.writeFileSync("./expensesData.json", JSON.stringify(expensesData));
 })
 
 app.get("/api/expenses", (req, res) => {
     const expense = fs.readFileSync("./expensesData.json")
     res.send(expense)
 })

 app.post('/api/login', (req, res) => {
    console.log(req.body);
    //const { email, password } = req.body;
    
        let token = jwt.sign({info: req.body}, secretKey, { expiresIn: '1m' });
            res.json({
                success: true,
                err: null,
                token
            });
    
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});