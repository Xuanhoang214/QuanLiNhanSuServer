const {Storage} = require('@google-cloud/storage');
var projectID = 'demoiuhcommunity';
var keyfilename = './key.json';
const storage = new Storage({projectId:projectID,keyFilename:keyfilename,});

module.exports = {
    storage:storage
}