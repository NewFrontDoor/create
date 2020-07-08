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
      "What is the URL? (only include domain name & tld, eg. 'ufcutas.org')",
    when(answers) {
      return answers.url_check;
    }
  },
  {
    type: 'checkbox',
    name: 'scaffold',
    message:
      'What would you like to scaffold for this project? (All by default)',
    choices: [
      {
        name: 'NextJS',
        checked: true
      },
      {
        name: 'Sanity',
        checked: true
      },
      {
        name: 'Theme',
        checked: true
      }
    ]
  },
  {
    type: 'confirm',
    name: 'standard_ui',
    message: 'Install standard UI library items?',
    default: 'Y'
  }
];

const nextjsQs = [];
const sanityQs = [];

const themeQs = (chalkPipe) => {
  return [
    {
      type: 'confirm',
      name: 'color_prompt',
      message: 'Do you have a colour scheme? (Will prompt for colours in hex)',
      when: (answers) => answers.scaffold.includes('Theme')
    },
    {
      type: 'input',
      name: 'color_primary',
      message: 'Primary (leave blank for auto-generated):',
      when: (answers) => answers.color_prompt,
      transformer: (color) => chalkPipe(color)(color)
    },
    {
      type: 'input',
      name: 'color_text',
      message: 'Text (leave blank for auto-generated):',
      when: (answers) => answers.color_prompt,
      transformer: (color) => chalkPipe(color)(color)
    },
    {
      type: 'input',
      name: 'color_background',
      message: 'Background (leave blank for auto-generated):',
      when: (answers) => answers.color_prompt,
      transformer: (color) => chalkPipe(color)(color)
    },
    {
      type: 'input',
      name: 'color_accent',
      message: 'Accent (leave blank for auto-generated):',
      when: (answers) => answers.color_prompt,
      transformer: (color) => chalkPipe(color)(color)
    },
    {
      type: 'input',
      name: 'color_muted',
      message: 'Muted (leave blank for auto-generated):',
      when: (answers) => answers.color_prompt,
      transformer: (color) => chalkPipe(color)(color)
    }
  ];
};

module.exports = {
  initialQs,
  nextjsQs,
  sanityQs,
  themeQs
};
