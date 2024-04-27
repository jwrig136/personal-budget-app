// Expense API

const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3001;
const fs = require("fs");
app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.post("/api/budget", (req, res) => {
   // console.log(req.body)
   const data = req.body;
    res.send(req.body)
    fs.writeFileSync("./budgetData.json", JSON.stringify(data));
})

app.get("/api/budget", (req, res) => {
    const expense = fs.readFileSync("./budgetData.json")
    res.send(expense)
})


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});