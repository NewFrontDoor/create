const initialQs = [
  {
    type: 'input',
    name: 'orgname',
    message: "What's the name of the organisation this project is for?"
  },
  {
    type: 'confirm',
    name: 'url_check',
    message:
      "Has a URL been chosen? (If 'Y' you'll need to provide it in the next question)"
  },
  {
    type: 'input',
    name: 'url',
    message:
      "What is the URL? (only include domain name + tld, eg. 'ufcutas.org')",
    when: function (answers) {
      return answers.url_check;
    }
  },
  {
    type: 'checkbox',
    name: 'scaffold',
    message:
      'What would you like to scaffold for this project? (Use space to select all which apply)',
    choices: [
      {
        name: 'NextJS'
      },
      {
        name: 'Sanity'
      },
      {
        name: 'Theme'
      }
    ]
  }
];

const nextjsQs = [
  {
    type: 'confirm',
    name: 'standard_ui',
    message: 'Install standard UI library items?',
    default: 'Y'
  }
];
const sanityQs = [
  {
    type: 'confirm',
    name: 'standard_ui_schemas',
    message: 'Install stardard UI library matching schemas?',
    default: 'Y'
  }
];

const themeQs = (chalkPipe) => {
  return [
    {
      type: 'confirm',
      name: 'color_prompt',
      message: 'Do you have a colour scheme? (Will prompt for colours in hex)',
      when: function (answers) {
        return answers.scaffold.includes('Theme');
      }
    },
    {
      type: 'input',
      name: 'color_text',
      message: 'Text:',
      default: '#000',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    },
    {
      type: 'input',
      name: 'color_background',
      message: 'Background:',
      default: '#FFF',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    },
    {
      type: 'input',
      name: 'color_primary',
      message: 'Primary:',
      default: '#07c',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    },
    {
      type: 'input',
      name: 'color_secondary',
      message: 'Secondary:',
      default: '#05a',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    },
    {
      type: 'input',
      name: 'color_accent',
      message: 'Accent:',
      default: '#609',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    },
    {
      type: 'input',
      name: 'color_muted',
      message: 'Muted:',
      default: '#fcfcfc',
      when: function (answers) {
        return answers.color_prompt;
      },
      transformer: function (color) {
        return chalkPipe(color)(color);
      }
    }
  ];
};

module.exports = {
  initialQs,
  nextjsQs,
  sanityQs,
  themeQs
};
