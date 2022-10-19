require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const { join } = require('path');

const RESOURCE_FILE_NAME = "convert01.tsv";
const resourcePath = path.join(__dirname, '..', 'Express/result', RESOURCE_FILE_NAME);

const EN_RESULT_NAME = "en-multilingualResource.tsv";
const enResultPath = path.join(__dirname, '..', 'Express/result', EN_RESULT_NAME);
const ZH_RESULT_NAME = "zh-multilingualResource.tsv";
const zhResultPath = path.join(__dirname, '..', 'Express/result', ZH_RESULT_NAME);
// console.log(csvPath);

const csv = fs.readFileSync(resourcePath, "utf-8");

//  get string from csv
const rows = csv.split("\r\n");
// console.log('rows', rows);

// let results = [];
const resource = [];

for (const i in rows) {
  const row = rows[i];
  const data = row.split("\t");
  resource.push(data[0]);
}


let resourceSet = Array.from(new Set(resource));
console.log('resource', resource);
console.log('resourceSet', resourceSet);

//  translation
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

//  google api v2는 한 번에 128세그먼트까지 요청을 받는다
//  resourceSet의 길이가 128 초과인 경우, 분할해 요청할 필요 있음 

const text = resourceSet;
let textBuff = [];

//  깊은 복사
text.forEach(item => {
  textBuff.push(item);
});

let bigText = [];

console.log('text', textBuff);

const target1 = 'en';
const target2 = 'zh';
const enTranslated = [];
const zhTranslated = [];

async function translateEn() {
  bigText = [];
  if (textBuff.length > 128) {
    for (let i = 0; i < 128; i++) {
      console.log('shift');
      bigText.push(textBuff.shift());
    }
  } else {
    console.log('ok');
    for (let i = 0; i < textBuff.length; i++) {
      bigText.push(textBuff.shift());
    }
    console.log('how many?', bigText.length);
  }

  let [translations] = await translate.translate(bigText, target1);
  translations = Array.isArray(translations) ? translations : [translations];
  // console.log('en Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${bigText[i]} => (${target1}) ${translation}`);
    enTranslated.push(translations[i]);
  });
  translateZh();
}translateEn();

async function translateZh() {
  let [translations] = await translate.translate(bigText, target2);
  translations = Array.isArray(translations) ? translations : [translations];
  // console.log('zh Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${bigText[i]} => (${target2}) ${translation}`);
    zhTranslated.push(translations[i]);
  });
  if (textBuff.length === 0) {
    fileWriter();
  } else {
    translateEn();
  }
};

function fileWriter() {
  console.log('t.lgth', text.length);
  console.log('file writing');
  let enStringSum = '';
  resource.forEach(item => {
    // console.log('item', item);
    let idx = text.findIndex((textItem) => textItem === item);
    // stringSum += text[idx] + '\t' + enTranslated[idx] + '\t' + zhTranslated[idx] + '\n';

      // enStringSum += enTranslated[idx];

      enStringSum += enTranslated[idx] + '\n';

    fs.writeFileSync(enResultPath, enStringSum)
  })

  let zhStringSum = '';
  resource.forEach(item => {
    // console.log('item', item);
    let idx = text.findIndex((textItem) => textItem === item);
    // stringSum += text[idx] + '\t' + enTranslated[idx] + '\t' + zhTranslated[idx] + '\n';
    if (resource.length === idx + 1) {
      zhStringSum += zhTranslated[idx];
    } else {
      zhStringSum += zhTranslated[idx] + '\n';
    }
    fs.writeFileSync(zhResultPath, zhStringSum)
  })

  console.log('success!');
};
