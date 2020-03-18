require("./ald/ald-game");
var GameResourceLoader = require('GameResourceLoader');
var StorageUtil = require('StorageUtil');
var Singleton = require('Singleton');
var GameHttpUtil = require('GameHttpUtil');
var ShareUtil = require('ShareUtil');
var AudioUtil = require('AudioUtil');
var AdUtil = require('AdUtil');

window.JZZC_ROOT_URL = 'https://www.game.jizhizhichuang.com/api/game';

// window.JZZC_AUTHOR_URL = 'https://www.school.jizhizhichuang.com/api/game/authorize';
window.JZZC_AUTHOR_URL = 'https://www.game.jizhizhichuang.com/api/game/authorize';
window.JZZC_APP_ID = 'wx';

// window.JZZC_CURRENT_GAME_ROOT_URL = 'https://www.school.jizhizhichuang.com/api/game/levels';
window.JZZC_CURRENT_GAME_ROOT_URL = 'https://www.game.jizhizhichuang.com/api/game/levels';

// window.JZZC_OSS_HOST = 'https://jzzc-test.oss-cn-shenzhen.aliyuncs.com';
// window.JZZC_OSS_HOST = 'https://jzzc-game.oss-cn-shenzhen.aliyuncs.com';

window.GlobalUtil = {
    init () {
        window.GameResourceLoader = new GameResourceLoader();
        window.GameHttpUtil = new GameHttpUtil();
        window.StorageUtil = new StorageUtil();
        window.Singleton = new Singleton();
        window.ShareUtil = new ShareUtil();
        window.AudioUtil = new AudioUtil();
        window.AdUtil = new AdUtil();
    }
};