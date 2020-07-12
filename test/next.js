const tempy = require('tempy');
const test = require('ava');
const path = require('path');
const sinon = require('sinon');
const {promises} = require('fs');
const globby = require('globby');
const proxyquire = require('proxyquire');

async function run(options) {
  const createNextApp = proxyquire('../lib/next', {
    execa: sinon.stub().returns({pipe: sinon.stub()})
  });

  const directory = tempy.directory();

  await promises.mkdir(
    path.join(directory, options.orgname, 'next-js', 'theme'),
    {
      recursive: true
    }
  );
  const next = createNextApp({
    ...options,
    cwd: directory
  });

  await next.create();

  return directory;
}

test('Scaffolding NextJs', async (t) => {
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
