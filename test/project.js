const tempy = require('tempy');
const test = require('ava');
const path = require('path');
const sinon = require('sinon');
const {promises} = require('fs');
const globby = require('globby');
const proxyquire = require('proxyquire');
const createProject = require('../lib/project');

const ONE_MINUTE = 60 * 1000;

async function run(answers) {
  const createNFD = proxyquire('..', {
    execa: sinon.stub().returns({pipe: sinon.stub()})
  });

  const directory = tempy.directory();

  const project = await createProject({
    ...answers,
    cwd: directory,
    sanity: {
      create() {
        return promises.mkdir(path.join(project.projectDir, 'sanity'));
      }
    }
  });

  await createNFD(project);

  return directory;
}

test('Scaffolding Everything', async (t) => {
  t.timeout(ONE_MINUTE);
  const directory = await run({
    orgname: 'example',
    scaffold: ['NextJS', 'Sanity', 'Theme']
  });

  const paths = await globby(['.'], {
    cwd: directory,
    dot: true,
    onlyFiles: false,
    expandDirectories: true,
    ignore: ['**/.git/**', '**/node_modules/**']
  });

  t.snapshot(paths);
});
