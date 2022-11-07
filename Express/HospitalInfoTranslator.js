const axios = require('axios');

require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

//  counter
let i = 0;
let j = 0;
let k = 0;

let text = [];
let targetItem = {};
let tempKeys = [];
let tempText = [];

let nullContainerEn = [];
let nullContainerCn = [];
let nullContainerTw = [];

let resultEn = [];
let resultCn = [];
let resultTw = [];

const target1 = 'en';
const target2 = 'zh-CN';
const target3 = 'zh-TW';

const nullReplacer = 'NLLNAUTOO';

axios.get('https://t.admin.natoo.co/api/hospital_detail/',
  {
    params: {
      hospital_id: 123275,
      language: 'ko',
      rows: 10000
    },
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    }
  })
  .then(ko_hospitals => {
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
        medical_part_desc: hospital.medical_part_desc,
        intro_desc: hospital.intro_desc,
        open_desc: hospital.open_desc,
        off_desc: hospital.off_desc,
        part_desc: hospital.part_desc,
        zip_no: hospital.zip_no,
        address: hospital.address,
        address_detail: hospital.address_detail,
        location_step1: hospital.location_step1,
        location_step2_1: hospital.location_step2_1,
        location_step2_2: hospital.location_step2_2,
        subway1: hospital.subway1,
        subway2: hospital.subway2,
        seller_license_no: hospital.seller_license_no
      }

      tempKeys = Object.keys(targetItem);
      tempText = Object.values(targetItem);
      text.push(tempText);

    })
    console.log('text', text);

    text.forEach(element => {
      async function translateEn() {
        let [translations] = await translate.translate(element, target1);
        console.log('Translations:', translations);
        translations = Array.isArray(translations) ? translations : [translations];

        //  value 에서 null 이스케이프 복구
        translations.forEach(translation => {
          if (translation == 'NLLNAUTOO') {
            translation = null;
          }
          nullContainerEn.push(translation);
        })
        console.log('nullContainerEn: ', nullContainerEn);

        //  key - value 형성
        resultEn = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainerEn[i++], acc), {});
        resultEn['language'] = 'en';
        console.log('resultEn: ', resultEn);

        //  save - en
          await axios.post('https://t.admin.natoo.co/api/hospital_detail/save',
            resultEn,
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
          translateCn()
      } translateEn();

      async function translateCn() {
        let [translations] = await translate.translate(element, target2);
        console.log('Translations:', translations);
        translations = Array.isArray(translations) ? translations : [translations];

        //  value 에서 null 이스케이프 복구
        translations.forEach(translation => {
          if (translation == 'NLLNAUTO') {
            translation = null;
          }
          nullContainerCn.push(translation);
        })
        console.log('nullContainerCn: ', nullContainerCn);

        //  key - value 형성
        resultCn = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainerCn[j++], acc), {});
        resultCn['language'] = 'zh_ch';
        console.log('resultCn: ', resultCn);

        //  save - cn
          await axios.post('https://t.admin.natoo.co/api/hospital_detail/save',
            resultCn,
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
          translateTw();
      };
      async function translateTw() {
        let [translations] = await translate.translate(element, target3);
        console.log('Translations:', translations);
        translations = Array.isArray(translations) ? translations : [translations];

        //  value 에서 null 이스케이프 복구
        translations.forEach(translation => {
          if (translation == 'NLLNAUTO') {
            translation = null;
          }
          nullContainerTw.push(translation);
        })
        console.log('nullContainerCn: ', nullContainerTw);

        //  key - value 형성
        resultTw = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainerTw[k++], acc), {});
        resultTw['language'] = 'zh_tw';
        console.log('resultTw: ', resultTw);

        //  save - tw
          await axios.post('https://t.admin.natoo.co/api/hospital_detail/save',
            resultTw,
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
      };
    })
    console.log('success!');
  })
