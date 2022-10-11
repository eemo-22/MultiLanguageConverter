require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const FILE_NAME = "natooLang.csv";
const csvPath = path.join(__dirname, '..', 'Express/csv', FILE_NAME);
// console.log(csvPath);

const csv = fs.readFileSync(csvPath, "utf-8");

const rows = csv.split("\n");
console.log(rows);

let results = [];
let columnTitle = [];
for (const i in rows) {
  const row = rows[i];
  const data = row.split(",");
  if (i === "0") {
    columnTitle = data;
    console.log(columnTitle);
  } else {
    let row_data = {};
    for (const index in columnTitle) {
      const title = columnTitle[index];
      row_data[title] = data[index];
    }
    results.push(row_data);
  }
}
// console.log(results);

const resource = [];
for (let i in results) {
  const korean = results[i].ko;
  resource.push(korean);
}
console.log(resource);

// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

const text = resource;
const target1 = 'en';
const target2 = 'zh';

async function translateEn() {
  let [translations] = await translate.translate(text, target1);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${text[i]} => (${target1}) ${translation}`);
  });
}
async function translateZh() {
  let [translations] = await translate.translate(text, target2);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${text[i]} => (${target2}) ${translation}`);
  });
}

translateEn();
translateZh();

