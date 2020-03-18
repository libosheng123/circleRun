let shareImages = {
  zhuan_fa: {
    imageUrlId: "uTIA+RVYTLCAPZDnZEqY8g==",
    imageUrl: "https://mmocgame.qpic.cn/wechatgame/rKqy1TWM7SQ4Th2qia4N9licvQicOoCXbrSSkEkRicfPFoI4V7yicd2HWtICPgGicmw0JU/0",
    path: ""
  }
};

var wxShareUtil = cc.Class({
  properties: {},
  ctor() {
    if (typeof wx != 'undefined') {
      wx.showShareMenu();
      wx.onShareAppMessage(() => {
        return this.getShareForTransmit();
      });
      wx.onShow(launchOpions => {
        if (this.shareCallback) {
          this.shareCallback();
        }
      });
    }
  },
  configShare(shareCallback) {
    this.shareCallback = shareCallback;
  },
  // 发起分享
  onShare() {
    wx.shareAppMessage(this.getShareForTransmit());
  },
  // 微信转发模板
  getShareForTransmit() {
    return this.getShareMessage("丛林中谁才是真正的超级大佬（脑）？", shareImages.zhuan_fa);
  },
  // 获取分享模板
  getShareMessage(title, shareImage) {
    return {
      title: title,
      imageUrl: shareImage.imageUrl,
      imageUrlId: shareImage.imageUrlId,
      query: shareImage.path
    };
  }
});
module.exports = wxShareUtil;
