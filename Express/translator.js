const axios = require('axios');

require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

let text = [];
let targetItem = {};
let tempKeys = [];
let tempText = [];
let translationContainer = [];
const target = 'en';

const nullReplacer = 'NLLNAUTOO';
const spaceReplacer = 'NSAPTAOCOE';

axios.get('https://t.admin.natoo.co/api/hospital_detail/',
  {
    params: {
      language: 'ko',
      rows: 10000
    },
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    }
  })
  .then(ko_hospitals => {
    // console.log('res!!!!!', ko_hospitals.data.list);

    ko_hospitals.data.list.forEach(hospital => {
      for (const idx in hospital) {
        if (hospital[idx] === null) {
          hospital[idx] = nullReplacer;
        }
        if (hospital[idx] === '') {
          hospital[idx] = spaceReplacer;
        }
      }
      // console.log(hospital);

      targetItem = {
        name: hospital.name,
        ceo_name: hospital.ceo_name,
        address: hospital.address,
        address_detail: hospital.address_detail,
        location_step1: hospital.location_step1,
        location_step2_1: hospital.location_step2_1,
        location_step2_2: hospital.location_step2_2,
        subway1: hospital.subway1,
        subway2: hospital.subway2,
      }

      tempKeys = Object.keys(targetItem);
      tempText = Object.values(targetItem);
      text.push(tempText);

    })
    // console.log(text);

    text.forEach(element => {
      async function translateText() {
        let [translations] = await translate.translate(element, target);
        translations = Array.isArray(translations) ? translations : [translations];

        translations.forEach((translation, i) => {
          if (translation == 'NLLNAUTOO') {
            translation = null;
            // translations.splice(translation);
            
            //  여기서 지금 그냥 push 하니까, 디버그 보니까 뒤로 붙어서 길이 9 넘는 그냥 배열 늘어남
            //  splice로 자기 자리 치환하도록 할 생각 하고 있음
            //  아니면 나중에 result 객체에서 처리해도 되는데...
          }
          if (translation == 'NSAPTAOCOE') {
            translation = '';
            translations.push(translation);
          }
        })
        console.log('Translations:', translations);

        //  key - value 형성
        let i = 0;
        const result = tempKeys.reduce((acc, curr) => (acc[curr] = translations[i++], acc), {});
        

        //  result 객체에서 모든 이스케이프 처리 시 코드가 엄청나게 될 것
        //  상단에서 배열 조절 해보고 안되면 여기에서 ㄱ

        // if (result.ceo_name === 'NLLNAUTOO') {
        //   result.ceo_name = null;
        // }
        // else if (result.ceo_name = 'NSAPTAOCOE') {
        //   result.ceo_name = '';
        // }

        console.log('result: ', result);
        
        //  value 에서 null, '' 이스케이프 복구

        //  save
        // await axios.post('https://t.admin.natoo.co/api/hospital_detail/save', {
        //   data: {
        //     name: result.name,
        //     ceo_name: result.ceo_name,
        //     address: result.address,
        //     address_detail: result.address_detail,
        //     location_step1: result.location_step1,
        //     location_step2_1: result.location_step2_1,
        //     location_step2_2: result.location_step2_2,
        //     subway1: result.subway1,
        //     subway2: result.subway2,
        //   },
        //   header: {
        //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        //     'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
        //   }
        // });

      } translateText();
    })
    console.log('success!');
  })
