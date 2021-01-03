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
    _.forEach(modEntries, function (object, index) {
        var alreadyBackedUp = (object.Name.endsWith('Backup') || _.includes(backedUpGames, object.Name));
        if(!options.all && alreadyBackedUp){
          // Don't show games that have already been backed up
          return;
        }
        console.log("[%s]: %s", index, object.Name);
    });
    return modEntries;
};

module.exports = {
    list: list
};
