require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const { join } = require('path');
const axios = require('axios');

const RESOURCE_FILE_NAME = "convert01.tsv";
const resourcePath = path.join(__dirname, '..', 'Express/resource', RESOURCE_FILE_NAME);

const EN_RESULT_NAME = "en-multilingualResource.tsv";
const enResultPath = path.join(__dirname, '..', 'Express/result', EN_RESULT_NAME);
const CN_RESULT_NAME = "cn-multilingualResource.tsv";
const cnResultPath = path.join(__dirname, '..', 'Express/result', CN_RESULT_NAME);
const TW_RESULT_NAME = "tw-multilingualResource.tsv";
const twResultPath = path.join(__dirname, '..', 'Express/result', TW_RESULT_NAME);
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

const text = resourceSet;
let textBuff = [];

text.forEach(item => {
  textBuff.push(item);
});

let bigText = [];

const target1 = 'en';
const target2 = 'zh-CN';
const target3 = 'zh-TW';
const enTranslated = [];
const cnTranslated = [];
const twTranslated = [];

async function translateApi(text, language) {
  axios.post('http://116.125.141.171:5002/ait/translate', 
  {
    target: language,
    text: text
  },
  {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    console.log('RES!!', response.data.result);
    response.data.result.forEach(element => {
      enTranslated.push(element.translatedText);
    })
  })
};

async function translateEn() {
  // bigText = [];
  // console.log('lllllllleee', textBuff.length);
  // if (textBuff.length > 128) {
  //   for (let i = 0; i < 128; i++) {
  //     console.log('shift');
  //     bigText.push(textBuff.shift());
  //   }
  // } else {
  //   console.log('ok');
  //   for (let i = 0; i < textBuff.length; i++) {
  //     bigText.push(textBuff.shift());
  //   }
  //   console.log('what?', bigText);
  //   console.log('how many?', bigText.length);
  // }
  await translateApi(textBuff , target1);
}translateEn();




// async function translateEn() {
//   bigText = [];
//   if (textBuff.length > 128) {
//     for (let i = 0; i < 128; i++) {
//       console.log('shift');
//       bigText.push(textBuff.shift());
//     }
//   } else {
//     console.log('ok');
//     for (let i = 0; i < textBuff.length; i++) {
//       bigText.push(textBuff.shift());
//     }
//     console.log('what?', bigText);
//     console.log('how many?', bigText.length);
//   }

//   let translations = await translateApi(bigText, target1);
//   // translations = Array.isArray(translations) ? translations : [translations];
//   console.log('en Translations:', translations);
//   translations.forEach((translation, i) => {
//     console.log(`${i}, ${bigText[i]} => (${target1}) ${translation}`);
//     enTranslated.push(translations[i]);
//   });
// }translateEn();
