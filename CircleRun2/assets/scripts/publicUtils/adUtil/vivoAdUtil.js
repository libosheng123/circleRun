// 全屏激励广告
const rewardedAD_ID = "31c9032f81034ee9b6c34d77b8abc670";
// 插屏广告
const interstitialAD_ID = "06e38ed9b2e6482690762f1704270e9e";
// banner广告
const bannerAD_ID = "98fbb9689f6e4a79b3d2df3c7cb51993";

var vivoAdUtil = cc.Class({
  properties: {},
  ctor() {
    this.bottomBannerShow = 0;
    if (cc.sys.platform == cc.sys.VIVO_GAME) {
      let platformVersionCode = qg.getSystemInfoSync().platformVersionCode;
      this.allowRewardedAD = platformVersionCode >= 1041;
      this.allowBannerAD = platformVersionCode >= 1031;
    }
  },
  // 显示全屏激励广告
  showRewardedAD(showCallback) {
    return new Promise((r, j) => {
      if (!this.allowRewardedAD) {
        Singleton.toast("版本不支持", 1200);
        j();
      } else {
        let currentTime = new Date().getTime();
        if (
          this.lastShowRewardedVideoAdTime &&
          currentTime - this.lastShowRewardedVideoAdTime < 10000
        ) {
          Singleton.toast("暂时无法观看视频", 1200);
          j();
          return;
        }
        this.lastShowRewardedVideoAdTime = currentTime;
        this.rewardedVideoAd = qg.createRewardedVideoAd({
          posId: rewardedAD_ID
        });
        this.rewardedVideoAd.load();
        this.rewardedVideoAd.onLoad(() => {
          console.log("vivo---------- AD load success");
          let adshow = this.rewardedVideoAd.show();
          if (adshow) {
            adshow
              .then(() => {
                console.log("vivo---------- AD show success");
                if (showCallback) {
                  showCallback();
                }
                cc.game.pause();
              })
              .catch(err => {
                console.log(
                  "vivo---------- AD show error:" + JSON.stringify(err)
                );
                this.rewardedVideoAd.offClose();
                this.rewardedVideoAd.offLoad();
                this.rewardedVideoAd.offError();
                Singleton.toast("暂时无法观看视频", 1200);
                cc.game.resume();
                j();
              });
          }
        });

        this.rewardedVideoAd.onClose(res => {
          console.log("vivo---------- AD closed");
          this.rewardedVideoAd.offClose();
          this.rewardedVideoAd.offLoad();
          this.rewardedVideoAd.offError();
          cc.game.resume();
          if (res && res.isEnded) {
            r(true);
          } else {
            Singleton.toast("视频中途关闭", 1500);
            r(false);
          }
        });

        this.rewardedVideoAd.onError(res => {
          console.log("vivo----------- AD error：\n" + JSON.stringify(res));
          this.rewardedVideoAd.offClose();
          this.rewardedVideoAd.offLoad();
          this.rewardedVideoAd.offError();
          Singleton.toast("暂时无法观看视频", 1200);
          cc.game.resume();
          j();
        });
      }
    });
  },
  // 显示底部banner广告
  showBottomBannerAD() {
    if (!this.allowBannerAD) {
      return;
    }
    this.needShowBottomBanner = true;
    if (!this.bottomBannerAD || this.bottomBannerShow > 2) {
      if (this.bottomBannerAD) {
        this.bottomBannerAD.offLoad();
        this.bottomBannerAD.offClose();
        this.bottomBannerAD.offError();
        this.bottomBannerAD.destroy();
      }
      this.bottomBannerShow = 0;
      this.bottomBannerADLoaded = false;
      this.bottomBannerAD = qg.createBannerAd({
        posId: bannerAD_ID,
        style: {}
      });

      this.bottomBannerAD.onLoad(() => {
        this.bottomBannerADLoaded = true;
        console.log("vivo---------- banner AD load success");
        if (this.needShowBottomBanner) {
          this.bottomBannerShow++;
          this.bottomBannerAD.show();
        }
      });
      this.bottomBannerAD.onError(res => {
        console.log(
          "vivo---------- banner AD load Error:" + JSON.stringify(res)
        );
      });
      this.bottomBannerAD.onClose(() => {
        console.log("vivo---------- banner AD closed");
      });
    } else if (this.bottomBannerADLoaded) {
      this.bottomBannerShow++;
      this.bottomBannerAD.show();
    }
  },
  // 隐藏底部banner广告
  hiddenBottomBannerAD() {
    this.needShowBottomBanner = false;
    if (this.bottomBannerAD) {
      this.bottomBannerAD.hide();
    }
  },
  showInterstitialAd() {
    if (!this.allowBannerAD) {
      return;
    }
    var interstitialAd = qg.createInterstitialAd({
      posId: interstitialAD_ID
    });
    console.log("vivo-------------- try show interstitial AD");
    interstitialAd.show();
    interstitialAd.onLoad(()=>{
      console.log("vivo--------------  interstitial AD load success");
    });
    interstitialAd.onError((err)=>{
      console.log("vivo--------------  interstitial AD show fail" + JSON.stringify(err));
      interstitialAd.offLoad();
      interstitialAd.offError();
    });
  }
});
module.exports = vivoAdUtil;
