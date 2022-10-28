const path = require("path");
const fs = require("fs");
const { join } = require('path');

const RESOURCE_FILE_NAME = "convert01.tsv";
const resourcePath = path.join(__dirname, '..', 'Express/resource', RESOURCE_FILE_NAME);

const RESULT_NAME = "natooHomeResult.tsv";
const ResultPath = path.join(__dirname, '..', 'Express/result', RESULT_NAME);

const content = fs.readFileSync(resourcePath, "utf-8");
let text = content.replace(/(<([^>]+)>)/ig, "☆★");

let tempResult = [];
let result = [];

tempResult = text.split(/(?<=★)(.*?)(?=☆)/);
result = tempResult.filter(item => {
  return (item !== '' && item !== '☆★')
})
console.log('result: ', result);

let resultSum = '';
result.forEach((item, i) => {
  resultSum += item + '\n';
  console.log('resultSum:', resultSum);
});

fs.writeFileSync(ResultPath, resultSum)
