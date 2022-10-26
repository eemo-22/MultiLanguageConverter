const axios = require('axios');

require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

let i = 0;
let text = [];
let targetItem = {};
let tempKeys = [];
let tempText = [];
let nullContainer = [];
let result = [];
const target = 'en';

const nullReplacer = 'NLLNAUTOO';

axios.get('https://t.admin.natoo.co/api/hospital_detail/',
  {
    params: {
      // hospital_id: 123162,
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
      }
      // console.log(hospital);

      targetItem = {
        hospital_id: hospital.hospital_id,
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
    console.log('text', text);

    text.forEach(element => {
      async function translateText() {
        let [translations] = await translate.translate(element, target);
        console.log('Translations:', translations);
        translations = Array.isArray(translations) ? translations : [translations];

        translations.forEach(translation => {
          if (translation == 'NLLNAUTOO') {
            translation = null;
          }
          nullContainer.push(translation);
        })

        console.log('nullContainer: ', nullContainer);


        //  key - value 형성
        result = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainer[i++], acc), {});
        
        result['language'] = 'en';
        console.log('result: ', result);

        //  value 에서 null, '' 이스케이프 복구

        //  save - en
          axios.post('https://t.admin.natoo.co/api/hospital_detail/save',
            result,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
              },
              withCredentials: false,
            })
            .then(res => {
              console.log('input res', res);
            })
            .catch(error => {
              console.log(error);
            })

      } translateText();
    })
    console.log('success!');
  })
