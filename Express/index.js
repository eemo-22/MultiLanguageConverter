require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
const express = require('express');

const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => {
  console.log(`Translation app listening on port ${port}`);
})

const path = require("path");
const fs = require("fs");
const FILE_NAME = "natooLang.csv";
const csvPath = path.join(__dirname, '..', 'Express/csv', FILE_NAME);
const csv = fs.readFileSync(csvPath, "utf-8");

// const translateRouter = require("./routes/translateRouter");

// const { Translate } = require('@google-cloud/translate').v2;
// const translate = new Translate();

// app.use('/api/translate', translateRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');

  console.log(csv);

})

