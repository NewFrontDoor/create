const stringifyObject = require('stringify-object');

const toKebabCase = (string) => {
  if (string) {
    return string
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+\d*|\b)|[A-Z]?[a-z]+\d*|[A-Z]|\d+/g)
      .map((x) => x.toLowerCase())
      .join('-');
  }
};

const hexToDec = (hex) => {
  if (hex) {
    return [
      Number.parseInt(hex.slice(1, 3), 16),
      Number.parseInt(hex.slice(3, 5), 16),
      Number.parseInt(hex.slice(5, 7), 16)
    ];
  }

  return 'N';
};

const decToHex = (dec) =>
  dec.map((item) => '#' + item.map((subitem) => subitem.toString(16)).join(''));

const nextColorFile = (palette) => {
  return `const baseColors = ${stringifyObject(palette, {
    indent: '  '
  })};
  
  export default {
    ...baseColors,
    // This is a workaround for consuming our own defined values
    active: baseColors.accent
  };

  `;
};

module.exports = {
  toKebabCase,
  hexToDec,
  decToHex,
  nextColorFile
};
