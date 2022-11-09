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

let doctor_temp_part_desc = [];
let doctor_temp_medical_part_desc =[];

const target1 = 'en';
const target2 = 'zh-CN';
const target3 = 'zh-TW';

const nullReplacer = 'NLLNAUTOO';

axios.get('https://admin.natoo.co/api/doctor_detail/',
  {
    params: {
      // doctor_id: 10132,
      language: 'ko',
      rows: 10000
    },
    headers: {
      'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    }
  })
  .then(ko_doctors => {
    ko_doctors.data.list.forEach(doctor => {
      for (const idx in doctor) {
        if (doctor[idx] === null) {
          doctor[idx] = nullReplacer;
        }
      }
      doctor_temp_part_desc.push(doctor.part_desc);
      doctor_temp_medical_part_desc.push(doctor.medical_part_desc);
      // console.log(doctor);

      targetItem = {
        doctor_id: doctor.doctor_id,
        name: doctor.name,
        career_history: doctor.career_history,
        position: doctor.position,
        major_name: doctor.major_name,
        part_desc: '',  //  한국어 -> code 처리
        medical_part_desc: '',  //  한국어 -> code 처리
      }

      tempKeys = Object.keys(targetItem);
      tempText = Object.values(targetItem);
      text.push(tempText);

    })
    console.log('text', text);

    text.forEach((element, idx) => {
      async function translateEn() {
        let [translations] = await translate.translate(element, target1);
        console.log('Translations:', translations);
        translations = Array.isArray(translations) ? translations : [translations];

        //  part_desc, medecal_part_desc 한국어 주입
        translations[translations.length - 2] = (doctor_temp_part_desc[idx]);
        translations[translations.length - 1] = (doctor_temp_medical_part_desc[idx]);

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
          await axios.post('https://admin.natoo.co/api/doctor_detail/save',
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

        translations[translations.length - 2] = (doctor_temp_part_desc[idx]);
        translations[translations.length - 1] = (doctor_temp_medical_part_desc[idx]);

        //  value 에서 null 이스케이프 복구
        translations.forEach(translation => {
          if (translation == 'NLLNAUTO') {
            translation = null;
          }
          // if (translation.includes('、') || translation.includes('，')) {
          //   translation = translation.replaceAll(/，|、/g, ',');
          // }
          nullContainerCn.push(translation);
        })
        console.log('nullContainerCn: ', nullContainerCn);

        //  key - value 형성
        resultCn = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainerCn[j++], acc), {});
        resultCn['language'] = 'zh_ch';
        console.log('resultCn: ', resultCn);

        //  save - cn
          await axios.post('https://admin.natoo.co/api/doctor_detail/save',
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

        translations[translations.length - 2] = (doctor_temp_part_desc[idx]);
        translations[translations.length - 1] = (doctor_temp_medical_part_desc[idx]);

        //  value 에서 null 이스케이프 복구
        translations.forEach(translation => {
          if (translation == 'NLLNAUTO') {
            translation = null;
          }
          // if (translation.includes('、') || translation.includes('，')) {
          //   translation = translation.replaceAll(/，|、/g, ',');
          // }
          nullContainerTw.push(translation);
        })
        console.log('nullContainerCn: ', nullContainerTw);

        //  key - value 형성
        resultTw = tempKeys.reduce((acc, curr) => (acc[curr] = nullContainerTw[k++], acc), {});
        resultTw['language'] = 'zh_tw';
        console.log('resultTw: ', resultTw);

        //  save - tw
          await axios.post('https://admin.natoo.co/api/doctor_detail/save',
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
