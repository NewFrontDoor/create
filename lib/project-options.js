const path = require('path');
const kebabCase = require('just-kebab-case');

function projectOptions({orgurl, cwd, orgname}) {
  let projectName;
  let projectDir;

  if (orgurl) {
    projectName = orgurl;
  } else {
    projectName = kebabCase(orgname);
  }

  if (cwd) {
    projectDir = path.resolve(cwd, projectName);
  } else {
    projectDir = path.resolve(projectName);
  }

  return {
    projectName,
    projectDir
  };
}

module.exports = projectOptions;
