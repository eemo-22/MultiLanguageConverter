const axios = require('axios');

require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

let text = [];
const target = 'en';

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
      // console.log(hospital);
      // if (
      //   hospital.name ||
      //   hospital.ceo_name || 
      //   hospital.address ||
      //   hospital.address_detail || 
      //   hospital.location_step1 ||
      //   hospital.location_step2_1 ||
      //   hospital.location_step2_2 ||
      //   hospital.subway1 ||
      //   hospital.subway2 === null
      // ) {

      // }

      let targetItem = {
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

      let tempText = Object.values(targetItem);

      text.push(tempText);
      // console.log('text', text);
    })
    // console.log('arrrrr', text)
    text.forEach(element => {
      console.log(element);
      if (element === null) {
        element = 'to be null';
      }
      async function translateText() {
        let [translations] = await translate.translate(element, target);
        translations = Array.isArray(translations) ? translations : [translations];
        console.log('Translations:', translations);
        // translations.forEach((translation, i) => {
        //   console.log(`${element[i]} => (${target}) ${translation}`);
        // });
      }


      translateText();
    })

  })






