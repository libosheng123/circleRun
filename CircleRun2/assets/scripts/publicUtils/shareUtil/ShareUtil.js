var _shareUtil = null;
if (typeof wx != "undefined") {
  _shareUtil = require("wxShareUtil");
}
var ShareUtil = cc.Class({
  properties: {

  },
  ctor () {
    if (_shareUtil) {
      this.shareUtilManager = new _shareUtil();
      this.shareUtilManager.configShare(()=>{
            if (this.shareTime) {
                var currentTime = new Date().getTime();
                var success = currentTime - this.shareTime > 3000;
                if (this.shareCallback) {
                  this.shareCallback(success);
                }
                this.shareTime = null;
                this.shareCallback = null;
            }
        });
    }
  },
  onShare (callback) {
    if (this.shareUtilManager) {
        // 记录获取分享时间
        this.shareTime = new Date().getTime();
        this.shareCallback = callback;
        this.shareUtilManager.onShare();
    } else {
        callback(false);
    }
  }
});

module.exports = ShareUtil;
