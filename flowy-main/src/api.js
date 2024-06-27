const axios = require('axios');
const app = require('./app');

////////// exports
module.exports.request = request;
module.exports.requestByItem = requestByItem;

////////// function
async function request(projectName, collectionName, itemName, environmentName){
    const apiItem = app.getItemByName(projectName, collectionName, itemName, environmentName);
    return await requestByItem(apiItem);
}
async function requestByItem(item){
    const response = await axios(item).catch(error => {
        console.error('error occured', error);
    });
    return {
        status: response.status,
        data: response.data
    };
}
