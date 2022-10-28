require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const { join } = require('path');

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
const target2 = 'zh-CN';
const target3 = 'zh-TW';
const enTranslated = [];
const cnTranslated = [];
const twTranslated = [];

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
  translateCn();
}translateEn();

async function translateCn() {
  let [translations] = await translate.translate(bigText, target2);
  translations = Array.isArray(translations) ? translations : [translations];
  // console.log('zh Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${bigText[i]} => (${target2}) ${translation}`);
    cnTranslated.push(translations[i]);
  });
  translateTw();
};

async function translateTw() {
  
  //  구글 API는 두 번째 인수로 시작, 도착 언어 코드를 포함하는 옵션 객체를 넘겨받는다.

  // const options = {
  //   from: 'zh-CN',
  //   to: 'zh-TW'
  // };
  // let [translations] = await translate.translate(bigText, options);

  let [translations] = await translate.translate(bigText, target3);
  translations = Array.isArray(translations) ? translations : [translations];
  // console.log('zh Translations:');
  translations.forEach((translation, i) => {
    console.log(`${i}, ${bigText[i]} => (${target3}) ${translation}`);
    twTranslated.push(translations[i]);
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
    if (resource.length === idx + 1) {
      enStringSum += enTranslated[idx];
    } else {
      enStringSum += enTranslated[idx] + '\n';
    }
    fs.writeFileSync(enResultPath, enStringSum)
  })

  let cnStringSum = '';
  resource.forEach(item => {
    let idx = text.findIndex((textItem) => textItem === item);
    if (resource.length === idx + 1) {
      cnStringSum += cnTranslated[idx];
    } else {
      cnStringSum += cnTranslated[idx] + '\n';
    }
    fs.writeFileSync(cnResultPath, cnStringSum)
  })

  let twStringSum = '';
  resource.forEach(item => {
    let idx = text.findIndex((textItem) => textItem === item);
    if (resource.length === idx + 1) {
      twStringSum += twTranslated[idx];
    } else {
      twStringSum += twTranslated[idx] + '\n';
    }
    fs.writeFileSync(twResultPath, twStringSum)
  })

  console.log('success!');
};
