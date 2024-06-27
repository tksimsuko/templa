const app = require('./app');
const pipe = require('./pipe');
const api = require('./api');

////////// exports
module.exports.run = run;

////////// function
async function run(projectName, collectinName, itemName, environmentName, paramState){
    let state = paramState || {};
    const results = [];
    const environment = app.getEnvironment(projectName, environmentName);
    const flowItem = app.getItemByName(projectName, collectinName, itemName);
    const interval = flowItem.interval;
    if(flowItem.items){
        const itemList = [];
        for(const relatedItemInfo of flowItem.items){
            const item = await app.getItemByName(relatedItemInfo.project, relatedItemInfo.collection, relatedItemInfo.item, environmentName);
            itemList.push({
                in: item
            });
        }
        let prev = {};
        let next = {};
        for(let [index, item] of itemList.entries()){
            // prev next 保持
            prev = itemList[index - 1] || {};
            next = itemList[index + 1] || {};

            // state 適用
            item = app.applyState(item, state);
            
            // flow
            let result;
            switch(item.in.type){
                case 'script':
                    result = await item.in.script(item, prev, next, state, environment);
                    item.out = result;
                    results.push(item);
                    break;
                case 'pipe':
                    result = await pipe.apply(item, prev, next, state, environment);
                    item.out = result;
                    results.push(item);
                    break;
                case 'api':
                    result = await api.requestByItem(item.in);
                    item.out = result;
                    results.push(item);
                    break;
                case 'flow':
                    result = await run(relatedItemInfo.project, relatedItemInfo.collection, relatedItemInfo.item, environmentName, state);
                    item.out = result;
                    results.push(item);
                    break;
                default:
                    // TODO エラーハンドリング
                    item.out = {
                        error: 'item type is invalid'
                    };
                    results.push(item);
                    break;
            }

            // interval
            if(interval){
                await new Promise(resolve => setTimeout(resolve, interval));
            }
        }
    }
    return {
        in: flowItem,
        out: results,
        state: state
    };
}
