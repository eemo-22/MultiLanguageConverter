const express = require('express');
const router = express.Router();

router.post('/post/test', (req, res) => {
  console.log('req', req);
  res.send('it works!');
});

router.post('/post/translate', async(req, res) => {
  const answer = await translateText(req)
  res.send(answer);
});


// Imports the Google Cloud client library
const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */



async function translateText(req) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  const text = req.text;
  const target = req.language;
  let [translations] = await translate.translate(req, target);
  return translations = Array.isArray(translations) ? translations : [translations];
}

// translateText();

module.exports = router;