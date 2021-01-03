var fs = require('fs');
var _ = require('lodash');
var WorkshopHelper = require('../util/workshop_helper');

var list = function (options) {
    var workshopInfosPath = _.get(options, 'workshopFileInfosPath') || WorkshopHelper.defaultWorkshopInfosPath();
    var allMods = JSON.parse(fs.readFileSync(workshopInfosPath));
    var modEntries = _.chain(allMods).filter(function (object) {
        return _.endsWith(object.Directory, 'json');
    }).uniqBy('Name').sortBy('Name').value();

    var backedUpGames = [];
    _.forEach(modEntries, function (object, index) {
        if(object.Name.endsWith('Backup')){
          backedUpGames.push(object.Name.replace(' Backup', ''));
        }
    });

    // Read backed up games
    fs.readdirSync(options.downloadDirectory).forEach(file => {
        var gameJson = JSON.parse(fs.readFileSync(options.downloadDirectory + "/" + file + "/" + file + ".json"));
        backedUpGames.push(gameJson.SaveName);
    });
    var uniqueBackedUpGames = [...new Set(backedUpGames)]
    _.forEach(modEntries, function (object, index) {
        var alreadyBackedUp = (object.Name.endsWith('Backup') || _.includes(uniqueBackedUpGames, object.Name));
        if(options.all || !alreadyBackedUp){
            console.log("[%s]: %s", index, object.Name);
        }
    });
    return modEntries;
};

module.exports = {
    list: list
};
