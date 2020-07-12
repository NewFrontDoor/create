const fetch = require('node-fetch');

const {hexToDec, decToHex} = require('./utility');

const generatePalette = async (answers) => {
  let body;
  if (answers) {
    body = {
      model: 'ui',
      input: [
        hexToDec(answers.color_background),
        hexToDec(answers.color_accent),
        hexToDec(answers.color_primary),
        hexToDec(answers.color_muted),
        hexToDec(answers.color_text)
      ]
    };
  } else {
    body = {
      model: 'ui',
      input: ['N', 'N', 'N', 'N', 'N']
    };
  }

  const response = await fetch('http://colormind.io/api/', {
    method: 'POST',
    body: JSON.stringify(body)
  });

  const {result} = await response.json();
  const colours = decToHex(result);

  const palette = {
    background: colours[0],
    accent: colours[1],
    primary: colours[2],
    muted: colours[3],
    text: colours[4]
  };

  return palette;
};

module.exports = {generatePalette};
