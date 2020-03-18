// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const RecorderTime = 45;
// 最小录屏时长
const minRecorderTime = 15000;
const minRecorderTimeErrMsg = "录屏时长小于15秒，无法分享";

cc.Class({
  extends: cc.Component,

  properties: {
    redHot: cc.Node,
    videoTimeLabel: cc.Label,
    blockLayout: cc.Node,
    videoTime: {
      set (v) {
        this._videoTime = v;
        this.videoTimeLabel.string = Math.floor(v/60)+":"+v%60;
      },
      get () {
        return this._videoTime;
      }
    }
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    if (typeof tt == "undefined") {
      this.node.active = false;
    } else {
      this.node.active = true;
      this.redHot.active = false;
      this.videoTimeLabel.node.active = false;
      this.ttInitRecorder();
    }
  },

  onDestroy () {
    if (typeof tt != "undefined") {
      const recorder = tt.getGameRecorderManager();
      recorder.onStop(()=>{});
      recorder.stop();
    }
  },

  clickButton() {
    if (typeof tt == "undefined") return;
    
    // 已经开始录制视频 或者 已经有地址了
    if (this.recorderStarted || this.recorderVideoPath) {
        this.ttShareRecorder(rsp => {
            if (rsp.errMsg) {
              Singleton.toast(rsp.errMsg);
            } else {
              let _THIS = this;
              tt.shareAppMessage({
                channel: "video",
                extra: {
                  videoPath: rsp.path
                },
                success() {
                  _THIS.videoTimeLabel.node.active = false;
                  _THIS.recorderVideoPath = null;
                  let diamond = 20;
                  _THIS.blockLayout.blockLayout.diamond += diamond;
                  Singleton.userGameInfo.diamond += diamond;
                  Singleton.saveLocalUserGameInfo();
                  Singleton.toast("分享成功，获得"+diamond+"能量石！", 2000);
                },
                fail(e) {
                  _THIS.videoTimeLabel.node.active = false;
                  _THIS.recorderVideoPath = null;
                  Singleton.toast("分享失败");
                }
              });
              this.redHot.stopAllActions();
              this.redHot.opacity = 0;
              this.redHot.active = false;
              this.endTimer();
            }
        });
    } else {
        this.ttStartRecorder();
    }
  },
  ttInitRecorder() {
    if (typeof tt != "undefined") {
      const recorder = tt.getGameRecorderManager();
      recorder.onStop(res => {
        this.recorderStarted = false;
        this.endRecorderTime = new Date().getTime();
        this.recorderVideoPath = res.videoPath;
        console.log(
          "recorder.onStop time:" +
            (this.endRecorderTime - this.startRecorderTime)
        );
        console.log(res.videoPath);
        // do somethine;
        if (this.ttShareRecorderCallback) {
          if (this.endRecorderTime - this.startRecorderTime < minRecorderTime) {
            this.ttShareRecorderCallback({ errMsg: minRecorderTimeErrMsg });
            this.ttShareRecorderCallback = null;
          } else {
            this.ttShareRecorderCallback({ path: res.videoPath });
            this.ttShareRecorderCallback = null;
          }
        } else {
          Singleton.toast("录屏结束，再次点击可以分享视频", 3000);
          this.redHot.stopAllActions();
          this.redHot.opacity = 0;
          this.redHot.active = false;
          this.endTimer();
        }
      });
      recorder.onStart(res => {
        this.recorderStarted = true;
        Singleton.toast("开始录屏");
        console.log("recorder.onStart");
        // do somethine;
        this.redHot.active = true;
        this.startTimer();
        this.redHot.opacity = 0;
        cc.tween(this.redHot)
          .then(
            cc
              .tween()
              .to(0.2, { opacity: 0 })
              .delay(0.1)
              .to(0.2, { opacity: 255 })
              .delay(0.1)
          )
          .repeatForever()
          .start();
      });
    }
  },
  startTimer () {
    this.videoTime = 0;
    this.videoTimeLabel.node.color = new cc.Color(255, 0, 0);
    this.videoTimeLabel.node.active = true;
    this.schedule(this.timerUpdate, 1);
  },
  endTimer () {
    this.unschedule(this.timerUpdate);
    this.videoTimeLabel.node.color = new cc.Color(255, 255, 255);
    // this.videoTimeLabel.node.active = false;
  },
  timerUpdate () {
    this.videoTime ++;
  },
  // 头条录制视频
  ttStartRecorder() {
    if (typeof tt != "undefined") {
      this.startRecorderTime = new Date().getTime();
      this.recorderVideoPath = null;
      this.ttShareRecorderCallback = null;
      this.endRecorderTime = null;
      const recorder = tt.getGameRecorderManager();
      recorder.start({
        duration: RecorderTime
      });
    }
  },
  ttStopRecorder() {
    if (typeof tt != "undefined") {
      let recorderManager = tt.getGameRecorderManager();
      recorderManager.stop();
    }
  },
  ttShareRecorder(callback) {
    if (typeof tt != "undefined") {
      if (this.endRecorderTime) {
        if (this.endRecorderTime - this.startRecorderTime < minRecorderTime) {
          if (callback) callback({ errMsg: minRecorderTimeErrMsg });
          return;
        } else if (this.recorderVideoPath) {
          if (callback) callback({ path: this.recorderVideoPath });
        } else {
          if (callback) callback({ errMsg: "录屏失败" });
        }
      } else if (this.startRecorderTime) {
        let currentTime = new Date().getTime();
        console.log('currentTime ' + currentTime);
        console.log('startRecorderTime ' + this.startRecorderTime);
        console.log('duraton ' + (currentTime - this.startRecorderTime));
        console.log('minRecorderTime ' + minRecorderTime);
        if ((currentTime - this.startRecorderTime) < minRecorderTime) {
          if (callback) callback({ errMsg: minRecorderTimeErrMsg });
          return;
        }
        this.ttShareRecorderCallback = callback;
        let recorderManager = tt.getGameRecorderManager();
        recorderManager.stop();
      } else {
        this.showAlertMessage("录屏失败");
      }
    }
  }
  // update (dt) {},
});
