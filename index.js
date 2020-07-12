const Listr = require('listr');

function createNFD(project) {
  const tasks = new Listr([
    {
      title: 'Creating project repo',
      task: () =>
        new Listr([
          {
            title: `Creating project directory`,
            task: () => project.createProjectDirectory()
          },
          {
            title: 'Initialise package.json',
            task: () => project.writePackageJSON()
          },
          {
            title: 'Initialise .gitignore',
            task: () => project.writeGitIgnore()
          }
        ])
    },
    {
      title: 'Initialising Sanity project',
      enabled: () => project.scaffold.includes('Sanity'),
      task: () => project.createSanity()
    },
    {
      title: 'Initialising NextJS app',
      enabled: () => project.scaffold.includes('NextJS'),
      task: () => project.createNextApp()
    },
    {
      title: 'Pushing to GitHub',
      enabled: () => project.dryRun === false,
      task: () =>
        new Listr([
          {
            title: `Creating a new project for ${project.projectName}`,
            task: () => project.createRepo()
          },
          {
            title: 'Push project to github',
            enabled: () => project.dryRun === false,
            task: () => project.push()
          }
        ])
    }
  ]);

  return tasks.run();
}

module.exports = createNFD;
