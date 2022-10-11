require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const path = require("path");
const fs = require("fs");
const FILE_NAME = "natooLang.csv";
const csvPath = path.join(__dirname, '..', 'Express/csv', FILE_NAME);
// console.log(csvPath);

const csv = fs.readFileSync(csvPath, "utf-8");

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
    ko: csv.ko, //  이거 아마도 각 헤더 아래에 쭉 들어갈 내용일 듯 한데, 아직 미확인
    en: csv.en,
    zh: csv.zh,
  };
  result.push(data);
}

console.log(result);

const createCsvWirter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWirter({
  path: './Express/csv/csv-writer.csv', 
  header: csvWriterHeader,
});

csvWriter.writeRecords(result).then(() => {
  console.log('done!');
});