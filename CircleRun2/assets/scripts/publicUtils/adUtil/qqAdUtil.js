// 全屏激励广告
const rewardedAD_ID = "1a6019f0fa31eb267aa75b366a2be153";
// 盒子广告
const boxAD_ID = "b0545dd343c35ac351b6c0f8ace02847";
// banner广告
const bannerAD_ID = "06d0ac09c11e982f11d925e938520a1b";

var qqAdUtil = cc.Class({
  properties: {
  },
  ctor() {
  },
  // 创建全屏广告
  createRewardedAD () {
    console.log('--------- wx try create rewarded video AD');
    if (typeof wx != 'undefined' && wx.createRewardedVideoAd && !this.rewardedVideoAD) {
      this.rewardedVideoAD = wx.createRewardedVideoAd({adUnitId: rewardedAD_ID});
      this.rewardedVideoAD.onLoad(() => {
        console.log('--------- wx rewarded video AD onLoad');
        this.noRewardedAD = false;
      });
      this.rewardedVideoAD.onError(err => {
        console.log('--------- wx rewarded video AD load error: ' + err.errCode + '：' + err.errMsg);
        if (err.errCode == 0 
          || err.errCode == 1000 
          || err.errCode == 1001 
          || err.errCode == 1002 
          || err.errCode == 1003
          || err.errCode == 1004
          || err.errCode == 1005
          || err.errCode == 1006
          || err.errCode == 1007
          || err.errCode == 1008
          ) {
          this.noRewardedAD = true;
        } else {
          this.noRewardedAD = false;
        }
      });
    }
  },
  // 显示全屏激励广告
  showRewardedAD (showCallback) {
    return new Promise((resolve, reject)=>{
      if (this.rewardedVideoCloseCallback) {
        console.log('激励视频广告已经打开');
        reject();
      } else {
        console.log('--------- wx try show rewarded video AD');
        this.rewardedVideoCloseCallback = (res)=>{
          this.clearRewardedVideoCallback();
          cc.game.resume();
          if (res && res.isEnded) {
            // 用户看完广告
            resolve(true);
          } else {
            Singleton.toast('广告中途关闭', 2300);
            // 用户中途关闭了广告
            resolve(false);
          }
        };
        this.rewardedVideoAD.onClose(this.rewardedVideoCloseCallback);
        this.rewardedVideoAD.load().then(()=>{
          this.rewardedVideoAD.show()
          .then(()=>{
            console.log('--------- wx show rewarded video AD success');
            if (showCallback) {
              showCallback();
            }
            cc.game.pause();
          })
          .catch(()=>{
            console.log('--------- wx show rewarded video AD fail');
            this.clearRewardedVideoCallback();
            Singleton.toast('暂时无法观看视频');
            reject();
          })
        }).catch((err)=>{
          console.log('--------- wx show rewarded video AD error:\n' + err.errCode + ':'+err.errMsg);
          Singleton.toast('暂时无法观看视频');
          this.clearRewardedVideoCallback();
          // 显示失败
          reject();
        });
      }
    });
  },
  // 清除激励广告回调
  clearRewardedVideoCallback () {
    this.rewardedVideoAD.offClose(this.rewardedVideoCloseCallback); 
    this.rewardedVideoCloseCallback = null;
  },
  showInterstitialAd () {
    if (qq.createAppBox) {
        let appbox = qq.createAppBox({
            adUnitId: boxAD_ID
        })
        appbox.load().then(()=>{
            appbox.show();
        });
    }
  },
  showBottomBannerAD () {
    this.needShowAlertViewBannerAD = true;
    if (!this.alertViewBannerAD) {
      this.bannerShowCount = 0;
      var adStyle = this.getBottomBannerStyle();
      this.alertViewBannerAD = wx.createBannerAd({
        adUnitId: bannerAD_ID,
        style: adStyle
      });
      this.bannerOnError = (err)=>{
        this.alertViewBannerAD.destroy();
        this.alertViewBannerAD.offError(this.bannerOnError);
        this.alertViewBannerAD.offResize(this.bannerOnResize);
        this.alertViewBannerAD.offLoad(this.bannerOnLoad);
        this.alertViewBannerAD = null;
        console.log('banner广告加载失败 ' + err.errCode + ':' + err.errMsg);
      };
      this.bannerOnResize = (res)=>{
        if (res.width != adStyle.width) {
          this.alertViewBannerAD.style.left = adStyle.left + (adStyle.width-res.width)*0.5;
        }
        if (res.height != adStyle.height) {
          this.alertViewBannerAD.style.top = adStyle.top + (adStyle.height-res.height);
        }
      };
      this.bannerOnLoad = ()=>{
        if (this.needShowAlertViewBannerAD) {
          this.alertViewBannerAD.show();
        }
      };
      this.alertViewBannerAD.onError(this.bannerOnError);
      this.alertViewBannerAD.onResize(this.bannerOnResize);
      this.alertViewBannerAD.onLoad(this.bannerOnLoad);
    } else {
      this.bannerShowCount ++;
      this.alertViewBannerAD.show();
    }
  },
  hiddenBottomBannerAD () {
    this.needShowAlertViewBannerAD = false;
    if (this.alertViewBannerAD) {
      if (this.bannerShowCount > 3) {
        this.alertViewBannerAD.hide();
        this.alertViewBannerAD.offError(this.bannerOnError);
        this.alertViewBannerAD.offResize(this.bannerOnResize);
        this.alertViewBannerAD.offLoad(this.bannerOnLoad);
        this.alertViewBannerAD.destroy();
        this.alertViewBannerAD = null;
      } else {
        this.alertViewBannerAD.hide();
      } 
    }
  },
  getBottomBannerStyle () {
    // 微信屏幕大小
    let systemInfo = wx.getSystemInfoSync();
    let wxWidth = systemInfo.windowWidth;
    let wxHeight = systemInfo.windowHeight;

    let offsetY = 0;
    if (wxHeight/wxWidth>2) {
      offsetY = 30;
    }
    // 目标尺寸 
    let targetADHeight = 175;
    let targetADWidth = 750;
    // 750 * 185
    let nodeCenterP = cc.Canvas.instance.node.convertToNodeSpaceAR(cc.v2(cc.Canvas.instance.node.width * 0.5, targetADHeight*0.5 + offsetY));
    let left = cc.Canvas.instance.node.width*0.5 + nodeCenterP.x - targetADWidth*0.5;
    let top = cc.Canvas.instance.node.height*0.5 - nodeCenterP.y - targetADHeight*0.5;
    let width = targetADWidth;
    let height = targetADHeight;

    // 最终画布大小
    let gameWidth = cc.Canvas.instance.node.width;
    let gameHeight = cc.Canvas.instance.node.height;

    //换算微信倍数
    let wxScaleX = wxWidth/gameWidth;
    let wxScaleY = wxHeight/gameHeight;

    left *= wxScaleX;
    top *= wxScaleY;
    width *= wxScaleX;
    height *= wxScaleY;

    let style = {
      left: left,
      top: top,
      width: width,
      height: height
    };
    // console.log('style:'+ JSON.stringify(style));
    return style;
  },
});
module.exports = qqAdUtil;
