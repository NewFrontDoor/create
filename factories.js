const createNextApp = ({execa, repo}) => {
    console.log('Inside Create Next App function')
    const [reponame, url] = repo;
    execa.sync('npx', ['create-next-app', '-e', 'https://github.com/NewFrontDoor/nfd-nextjs-starter', reponame]);
    process.chdir(reponame);
    execa.command("git add -A . && git commit -a -m initial commit").stdout.pipe(process.stderr);
    /*execa('git', ['remote', 'add', 'origin', url]).stdout.pipe(process.stdout);
    
    execa('git', 'push -u origin master').stdout.pipe(process.stdout);*/
}
    
const createSanity = ({execa, repo, orgname, orgname_kebab}) => {
    // TODO: add committing to newly created repo
    console.log('Creating Sanity Project');
    execa('sanity', ['init', '-y', '--dataset', 'production', '--output-path', `../${orgname_kebab}-sanity`, '--create-project', `${orgname}`]).stdout.pipe(process.stderr);
}

const createRepo = async ({nfd, octokit, orgname, orgurl, orgname_kebab, type}) => {
    const reponame = type === 'NextJS' ? orgurl || `${orgname_kebab}-nextjs` : `${orgname_kebab}-sanity`
    /*const response = await octokit.repos.createInOrg({
            org: nfd,
            name: reponame,
            private: true,
            description: `${type} project for ${orgname}, build by New Front Door`
        }).catch((err) => {
            console.log(err)
        })*/
    const response = {
        data: {clone_url: 'https://github.com/NewFrontDoor/test-church-nextjs.git'}
    }
    return [reponame, response.data.clone_url];
}

module.exports = {createNextApp, createSanity, createRepo}