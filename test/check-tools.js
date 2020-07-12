const test = require('ava');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

test('all tools installed', async (t) => {
  const checkTools = proxyquire('../lib/check-tools', {
    execa: sinon
      .stub()
      .resolves({stdout: 'Some tool v10.0.0 https://tool.example.com'})
  });

  const result = await checkTools();
  t.deepEqual(result, {
    gh: '10.0.0',
    git: '10.0.0',
    node: '10.0.0',
    yarn: '10.0.0'
  });
});

test('a tool is not installed', async (t) => {
  const checkTools = proxyquire('../lib/check-tools', {
    execa: sinon.stub().rejects(new Error('Command failed with exit code 1'))
  });

  const error = await t.throwsAsync(checkTools());
  t.is(error.message, 'Install GitHub cli, https://cli.github.com/');
});
