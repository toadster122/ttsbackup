var fs = require('fs');
var _ = require('lodash');
var WorkshopHelper = require('../util/workshop_helper');

var list = function (options) {
    const workshopInfosPath = _.get(options, 'workshopFileInfosPath') || WorkshopHelper.defaultWorkshopInfosPath();
    const allMods = JSON.parse(fs.readFileSync(workshopInfosPath).toString());
    const modEntries = _.chain(allMods).filter(function (object) {
        return _.endsWith(object.Directory, 'json');
    }).uniqBy('Name').sortBy('Name').value();


    let backedUpGames = new Set();
    if(!options.all) {
        _.forEach(modEntries, function (object) {
            if (object.Name.endsWith('Backup')) {
                backedUpGames.add(object.Name.replace(' Backup', ''));
            }
        });

        // Read backed up games
        fs.readdirSync(options.downloadDirectory).forEach(file => {
            var fileContents = fs.readFileSync(options.downloadDirectory + "/" + file + "/" + file + ".json");
            var gameJson = JSON.parse(fileContents.toString());
            backedUpGames.add(gameJson.SaveName);
        });
    }
    _.forEach(modEntries, function (object, index) {
        const alreadyBackedUp = (object.Name.endsWith('Backup') || _.includes([...backedUpGames], object.Name));
        if(options.all || !alreadyBackedUp){
            console.log("[%s]: %s", index, object.Name);
        }
    });
    return modEntries;
};

module.exports = {
    list: list
};
