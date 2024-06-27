const fs = require('fs');
const path = require('path');
const { apply } = require('./pipe');

const projectRootPath = path.resolve(__dirname, '../project');
const settingPath = path.resolve(__dirname, '../setting');

////////// exports
module.exports.getRequestSetting = getRequestSetting;
module.exports.getItemByName = getItemByName;
module.exports.getEnvironment = getEnvironment;
module.exports.applySetting = applySetting;
module.exports.applyState = applyState;
module.exports.getScript = getScript;

////////// function
function getItemByName(projectName, collectinName, itemName, environmentName){
    const requestSetting = getRequestSetting();
    const environment = getEnvironment(projectName, environmentName);
    const item = getOriginalItem(projectName, collectinName, itemName);
    switch(item.type){
        case 'api':
            return applySetting(item, requestSetting, environment);
        case 'script':
            item.script = getScript(projectName, collectinName, itemName, item.scriptName);
            return item;
        default:
            return item;
    }
}
function getScript(projectName, collectionName, scriptName){
    return require(path.resolve(projectRootPath, projectName, 'collection', collectionName, 'script', scriptName));
}
function getRequestSetting(){
    return readJsonSync(path.resolve(settingPath, 'request.json'));
}
function getOriginalItem(projectName, collectionName, itemName){
    return readJsonSync(path.resolve(projectRootPath, projectName, 'collection', collectionName, itemName + '.json'));
}
function getEnvironment(projectName, environmentName){
    let result = {};
    const globalJsonPath = path.resolve(projectRootPath, projectName, 'environment', 'global.json');
    if(fs.existsSync(globalJsonPath)){
        result = readJsonSync(globalJsonPath) || {};
    }
    if(environmentName){
        const environmentJson = readJsonSync(path.resolve(projectRootPath, projectName, 'environment', environmentName + '.json'));
        result = mergeJson(result, environmentJson);
    }
    return result;
}
function applySetting(itemJson, systemRequestJson, envJson){
    let result = itemJson;
    if(systemRequestJson){
        result = mergeJson(itemJson, systemRequestJson);
    }
    if(envJson){
        result = mergeJsonReplaceString(result, envJson);
    }
    return result;
}
function applyState(itemJson, state){
    let result = itemJson;
    if(state){
        result = replaceJsonString(result, state);
    }
    return result;
}
function readJsonSync(pathParam){
    let result;
    try{
        const str = readFileSync(pathParam) || {};
        result = JSON.parse(str);
    }catch(err){
        console.error('readFileSync error', err);
        throw new Error(err.message);
    }
    return result || {};
}
function readFileSync(pathParam){
    let result;
    try{
        result = fs.readFileSync(pathParam, {encoding: 'utf8'});
    }catch(err){
        console.error('readFileSync error', err);
        throw new Error(err.message);
    }
    return result || '';
}
function mergeJson(aJson, bJson){
    const result = Object.assign(aJson);
    for(const key in bJson){
        const value = bJson[key];
        if(typeof(value) === 'object'){
            const itemObj = result[key] || {};
            result[key] = mergeJson(itemObj, value);
        }else{
            result[key] = value;
        }
    }
    return result;
}
function mergeJsonReplaceString(json, applyJson){
    const result = {};
    for(const key in json){
        const value = json[key];
        if(typeof(value) === 'string'){
            result[key] = replaceString(value, applyJson);
        }else if(typeof(value) === 'object'){
            result[key] = mergeJsonReplaceString(value, applyJson);
        }else{
            result[key] = value;
        }
    }
    return result;
}
function replaceJsonString(json, applyJson){
    for(const key in json){
        const value = json[key];
        if(typeof(value) === 'string'){
            json[key] = replaceString(value, applyJson);
        }else if(typeof(value) === 'object'){
            json[key] = replaceJsonString(value, applyJson);
        }
    }
    return json;
}
function replaceString(str, applyJson){
    return str.replace(/{{\s*(\w+)\s*}}/mg, (_, embededKey) => {
        if(embededKey && applyJson[embededKey]){
            return applyJson[embededKey];
        }
        return `{{${embededKey}}}`;
    });
}
