const path = require("path");
const fs = require("fs");
const { join } = require('path');

const RESOURCE_FILE_NAME = "userToNatooScenario.json";
const resourcePath = path.join(__dirname, '..', 'Express/resource', RESOURCE_FILE_NAME);

function convertToObject() {
  const gitple_scenario = fs.readFileSync(resourcePath, "utf-8");
  const parsedResource = JSON.parse(gitple_scenario);

  let init = [];
  let container = [];

  let i = 0;
  let keyIdx = 'message_' + ((i++).toString().padStart(4, '0'));

  parsedResource.graph.forEach(element => {
    init.push(element);

    if (element.value) {  //  value._contents -> 1차
      if (!element.value._contents == null || !element.value._contents == "") {
        container.push(element.value._contents);
        if (element.value._contents) {
          element.value._contents = '${$lang.' + keyIdx++ + '}';
        }
      }
      
      if (element.value._items) { //  value.items[_contents] -> 2차
        element.value._items.forEach(item => {
          if (!item._contents == null || !item._contents == "") {
            container.push(item._contents);
            item._contents = '${$lang.' + keyIdx + '}';
          }
        })
      }
    }

    if (element.children) { //  children[value._contents] -> 2차
      element.children.forEach(child => {
        if (!child.value._contents == null || !child.value._contents == "") {
          container.push(child.value._contents);
          child.value._contents = '${$lang.' + keyIdx + '}';
        }
      })
    }
  });

  console.log('changed obj', parsedResource.graph); //  key로 _contents를 변환한 시나리오
  console.log('values', container); //  key 매핑 위해 추출된 _contents: value

  console.log('최상위 요소들 수', init.length);
  console.log('지금까지 잡아낸 _contents 개수', container.length);

  
} convertToObject();