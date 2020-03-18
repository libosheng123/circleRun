
var _adUtil = null;
// 头条
if (typeof tt != 'undefined') {
  _adUtil = require('ttAdUtil');
}
else if (typeof qq != 'undefined') {
  _adUtil = require("qqAdUtil");
}
// 微信
else if (typeof wx != 'undefined') {
  _adUtil = require("wxAdUtil");
} 
// vivo
else if (cc.sys.platform == cc.sys.VIVO_GAME) {
  // _adUtil = window.SdkManager;
  _adUtil = require("vivoAdUtil");
}
// oppo
else if (cc.sys.platform == cc.sys.OPPO_GAME) {
  _adUtil = require("oppoAdUtil");
}

var AdUtil = cc.Class({
  properties: {

  },
  ctor () {
    if (_adUtil) {
      this.adManager = new _adUtil();
    }
  },
  // 创建全屏激励广告
  createRewardedAD () {
    if (this.adManager && this.adManager.createRewardedAD) {
      this.adManager.createRewardedAD();
    }
  },
  // 显示全屏激励广告
  showRewardedAD (showCallback) {
    if (this.adManager && this.adManager.showRewardedAD) {
      return this.adManager.showRewardedAD(showCallback);
    } else {
      return Promise.resolve(true);
    }
  },
  // 显示插屏广告
  showInterstitialAd () {
    if (this.adManager && this.adManager.showInterstitialAd) {
      this.adManager.showInterstitialAd();
    }
  },
  // 创建底部banner广告
  showBottomBannerAD () {
    if (this.adManager && this.adManager.showBottomBannerAD) {
      this.adManager.showBottomBannerAD();
    }
  },
  // 隐藏底部banner广告
  hiddenBottomBannerAD () {
    if (this.adManager && this.adManager.hiddenBottomBannerAD) {
      this.adManager.hiddenBottomBannerAD();
    }
  }
});
module.exports = AdUtil;
