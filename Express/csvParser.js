require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const { join } = require('path');

const SAVE_FILE_NAME = "resource.csv";
const resourcePath = path.join(__dirname, '..', 'Express/result', SAVE_FILE_NAME);

const RESULT_NAME = "multilingualResource.tsv";
const resultPath = path.join(__dirname, '..', 'Express/result', RESULT_NAME);
// console.log(csvPath);

const csv = fs.readFileSync(resourcePath, "utf-8");

//  get string from csv
const rows = csv.split("\r\n");
// console.log('rows', rows);

let results = [];
let columnTitle = [];
for (const i in rows) {
  const row = rows[i];
  const data = row.split("\t");
  if (i === "0") {
    columnTitle = data;
    // console.log('columnTitle', columnTitle);
  } else {
    let row_data = {};
    for (const index in columnTitle) {
      const title = columnTitle[index];
      row_data[title] = data[index];
    }
    results.push(row_data);
  }
}
//  get Korean resources
const resource = [];
for (let i in results) {
  const korean = results[i].ko;
  resource.push(korean);
}
console.log('resource', resource);

//  translation
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

const text = resource;
const target1 = 'en';
const target2 = 'zh';
const enTranslated = [];
const zhTranslated = [];

async function translateEn() {
  let [translations] = await translate.translate(text, target1);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('en Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${text[i]} => (${target1}) ${translation}`);
    enTranslated.push(translations[i]);
  });
  translateZh();
} translateEn();

async function translateZh() {
  let [translations] = await translate.translate(text, target2);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('zh Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${text[i]} => (${target2}) ${translation}`);
    zhTranslated.push(translations[i]);
  });
  fileWriter();
};

function fileWriter() {

  let stringSum = '';
  for (let i = 0; i < text.length; i++) {
    stringSum += text[i] + '\t' + enTranslated[i] + '\t' + zhTranslated[i] + '\n';
  }

  fs.writeFileSync(resultPath, stringSum)
  console.log('success!');
};
