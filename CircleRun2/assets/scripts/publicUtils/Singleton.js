
const first_open_key = "is_first_open_1_0_1";
const local_userinfo_key = "user_game_info_1_0_1";

const Platforms = require('./types').Platforms;

// 默认用户数据
const defaultUserGameInfo = {
  // 用户id
  userId: "",
  // 对战id
  matchvsUserId: '',
  // 对战token
  matchvsToken: '',
  // 昵称
  nickname: "我是云玩家",
  // 头像
  avatar: "",
  // 最佳得分
  maxScore: 0,
  // 最低得分
  minScore: -1,
  // 总得分
  totalScore: 0,
  // 总步数
  totalStep: 0,
  // 砖石
  diamond: 0,
  // 最高步数
  maxStepCount: 0,
  // 最高合成蓝板
  maxCompoundSelf: 1,
  // 最高合成黄板
  maxCompoundCoin: 1,
  // 最高出现红板
  maxEnemyIn: 2,
  // 最高吃掉红板
  maxEatEnemy: 0,
  // 最高吃掉黄板
  maxEatCoin: 0,
  // 发现的稀有怪
  findRareCount: 0,
  // 击退的稀有怪
  eatRareCount: 0
};

var Singleton = cc.Class({
  properties: {
    toastUtil: null,
    weaponConfig: null,
    enemyConfig: null,
    levelModelsConfig: null,
    modelSegmentsConfig: null,
    enemyBatchsConfig: null,
    platform: Platforms.WX
  },
  ctor() {
    // 检查是否第一次登陆
    this.checkIsFirstOpen();

    // this.checkServerTime();
    // // 监听onShow
    // this.onGameShow(()=>{
    //   this.checkServerTime();
    // });
    // setInterval(()=>{
    //   if (this.serverTimestamp) {
    //     this.serverTimestamp += 1000;
    //   }
    // }, 1000);
  },
  onGameShow (fun) {
    if (typeof wx != "undefined") {
      wx.onShow(fun);
    } else if (cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.platform == cc.sys.OPPO_GAME) {
      qg.onShow(fun);
    } else {
      // cc.game.on(cc.game.EVENT_SHOW, fun);
    }
  },
  offGameShow (fun) {
    if (typeof wx != "undefined") {
      wx.offShow(fun);
    } else if (cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.platform == cc.sys.OPPO_GAME) {
      qg.offShow(fun);
    } else {
      // cc.game.off(cc.game.EVENT_SHOW, fun);
    }
  },
  onGameHide (fun) {
    if (typeof wx != "undefined") {
      wx.onHide(fun);
    } else if (cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.VIVO_GAME == cc.sys.OPPO_GAME) {
      qg.onHide(fun);
    } else {
      // cc.game.on(cc.game.EVENT_HIDE, fun);
    }
  },
  offGameHide (fun) {
    if (typeof wx != "undefined") {
      wx.offHide(fun);
    } else if (cc.sys.platform == cc.sys.VIVO_GAME || cc.sys.VIVO_GAME == cc.sys.OPPO_GAME) {
      qg.offHide(fun);
    } else {
      // cc.game.off(cc.game.EVENT_HIDE, fun);
    }
  },
  // 检查是否第一次打开
  checkIsFirstOpen() {
    StorageUtil.getLocalData(first_open_key).then((data)=>{
      if (data.isShowGuided) {
        this.isFirstOpen = false;
      } else {
        this.isFirstOpen = true;
      }
    })
    .catch(()=>{
      this.isFirstOpen = true;
    });
  },
  // 设置已看过引导
  setFinishGuide() {
    this.isFirstOpen = false;
    StorageUtil.saveLocalData(first_open_key, { isShowGuided: true });
  },
  // 检查服务器时间
  checkServerTime (callback) {
    GameHttpUtil.getServerTime().then((timestamp)=>{
      this.serverTimestamp = timestamp;
      console.log(new Date(timestamp).Format('yyyy-MM-dd hh:mm:ss'));
      if (callback) {
        callback();
      }
    }, (error)=>{
    });
  },
  // 保存本地游戏信息
  saveLocalUserGameInfo() {
    StorageUtil.saveLocalData(local_userinfo_key, this.userGameInfo);
  },
  // 获取本地游戏信息
  loadLocalUserGameInfo() {
    return new Promise((r)=>{
      if (this.userGameInfo) {
        r (this.userGameInfo);
      } else {
        StorageUtil.getLocalData(local_userinfo_key)
        .then((data)=>{
          this.userGameInfo = data;
          r(this.userGameInfo);
        })
        .catch(()=>{
          this.userGameInfo = defaultUserGameInfo;
          r(this.userGameInfo);
        });
      }
    });
  },
  // 上传用户游戏信息
  uploadUserGameInfo() {
    return new Promise((r, j)=>{
      let param = {
        platform: this.platform,
        highestScore: this.userGameInfo.maxScore,
        nickname: this.userGameInfo.nickname
      };
      if (this.userGameInfo.userId) {
        param.id = this.userGameInfo.userId;
      }
      if (this.userGameInfo.minScore >= 0) {
        param.lowestScore = this.userGameInfo.minScore;
      }
      GameHttpUtil.uploadUserGameInfo(param)
      .then((userInfo)=>{
        if (!this.userGameInfo.userId) {
          this.userGameInfo.userId = userInfo.id;
          this.saveLocalUserGameInfo();
        }
        r();
      })
      .catch(()=>{
        j();
      });
    });
  },
  // 获取高分榜
  loadHighestRanking () {
    return GameHttpUtil.loadWorldRanking(0, 50, "highestScore");
  },
  // 获取低分榜
  loadLowestRanking () {
    return GameHttpUtil.loadWorldRanking(0, 50, "lowestScore");
  },
  // 弹提示
  toast (message, dt) {
    if (this.toastUtil) {
      this.toastUtil.showToast(message, dt);
    }
  },
  // 分发事件
  dispatchDataEvent (action, data) {
    let event = new cc.Event(action, true);
    event["data"] = data;
    cc.systemEvent.dispatchEvent(event);
  }
});

Date.prototype.Format = function (fmt) {
  var o = {
          "M+": this.getMonth() + 1, // 月份
          "d+": this.getDate(), // 日
          "h+": this.getHours(), // 小时
          "m+": this.getMinutes(), // 分
          "s+": this.getSeconds(), // 秒
          "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
          "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

module.exports = Singleton;