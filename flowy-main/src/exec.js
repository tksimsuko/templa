const app = require('./app');
const api = require('./api');
const pipe = require('./pipe');
const flow = require('./flow');

////////// exports
module.exports.exec = exec;

////////// function
async function exec(projectName, collectinName, itemName, environmentName, paramState){
    const state = paramState || {};
    const item = app.getItemByName(projectName, collectinName, itemName, environmentName);
    
    let result;
    switch(item.type){
        case 'script':
            result = await item.script(item, {}, {}, state, environment);
            break;
        case 'pipe':
            result = await pipe.apply({in: item}, {}, {}, state, environment);
            break;
        case 'api':
            result = await api.requestByItem(item);
            break;
        case 'flow':
            result = await flow.run(projectName, collectinName, itemName, environmentName, state);
            break;
        default:
            // TODO エラーハンドリング
            console.error('item type is invalid');
            break;
    }
    return result;
}