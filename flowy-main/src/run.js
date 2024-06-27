const exec = require('./exec');

(async () => {
    console.log('-------------------- start --------------------');

    const projectName = process.argv[2];
    const collectionName = process.argv[3];
    const itemName = process.argv[4];
    const envName = process.argv[5];
    const state = process.argv[6] || {};

    if(!projectName){
        console.error(`command parameter project name is not found [${projectName}]`);
        return;
    }
    if(!collectionName){
        console.error(`command parameter collection name is not found [${collectionName}]`);
        return;
    }
    if(!itemName){
        console.error(`command parameter item name is not found [${itemName}]`);
        return;
    }
    if(!envName){
        console.error(`command parameter environment name is not found [${envName}]`);
        return;
    }

    let result;
    try{
        result = await exec.exec(projectName, collectionName, itemName, envName, state);
    }catch(err){
        console.error('exec error occurred', err);
    }

    console.log('---------- result ----------', result);
    console.log('-------------------- end --------------------');

})();