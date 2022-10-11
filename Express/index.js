require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
const express = require('express');
const app = express();
const port = 3000;

const path = require("path");
const fs = require("fs");
const FILE_NAME = "natooLang.csv";
const csvPath = path.join(__dirname, '..', 'Express/csv', FILE_NAME);
const csv = fs.readFileSync(csvPath, "utf-8");

// const translateRouter = require("./routes/translateRouter");

const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

// app.use('/api/translate', translateRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');

  const rows = csv.split("\r\n");
  let results = [];
  let columnTitle = [];
  for (const i in rows) {
    const row = rows[i];
    const data = row.split(",");
    if (i === "0") {
      columnTitle = data;
    } else {
      let row_data = {};
      for (const index in columnTitle) {
        const title = columnTitle[index];
        row_data[title] = data[index];
      }
      results.push(row_data);
    }
  }
  // console.log(results[0].ko);

  const resource = [];
  for (let i in results) {
    const korean = results[i].ko;
    resource.push(korean);
  }
  console.log(resource);
  console.log(Array.isArray(resource));

  const txtHeader = ['ko', 'en', 'zh'];
const csvWriterHeader = txtHeader.map((el) => {
  return {
    id: el,
    title: el
  };
});

let result = [];
for (let i = 0; i < 10; i++) {
  let data = {
    ko: csv.ko,
    en: csv.en,
    zh: csv.zh,
  };
  result.push(data);
}

console.log(result);

  // const text = resource;
  // const target = 'en';

  // async function translateText() {
  //   let [translations] = await translate.translate(text, target);
  //   translations = Array.isArray(translations) ? translations : [translations];
  //   console.log('Translations:');
  //   translations.forEach((translation, i) => {
  //     console.log(`${text[i]} => (${target}) ${translation}`);
  //   });
  // }
  // translateText();
})

app.listen(port, () => {
  console.log(`Translation app listening on port ${port}`);
})
