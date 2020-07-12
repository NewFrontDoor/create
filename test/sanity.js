const tempy = require('tempy');
const test = require('ava');
const path = require('path');
const sinon = require('sinon');
const {promises} = require('fs');
const globby = require('globby');
const proxyquire = require('proxyquire');

async function run(options) {
  const createSanity = proxyquire('../lib/sanity', {
    execa: sinon.stub().returns({pipe: sinon.stub()})
  });

  const directory = tempy.directory();

  await promises.mkdir(path.join(directory, options.orgname, 'sanity'), {
    recursive: true
  });
  const sanity = createSanity({
    ...options,
    cwd: directory
  });

  await sanity.create();

  return directory;
}

test('Scaffolding Sanity', async (t) => {
  const directory = await run({
    orgname: 'example',
    palette: {}
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
