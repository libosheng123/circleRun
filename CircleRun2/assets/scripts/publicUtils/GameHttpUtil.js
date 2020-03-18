var GameHttpUtil = cc.Class({
  properties: {

  },
  ctor () {
    
  },
  XMLHttpRequest (url, params) {
    return new Promise((resolve, reject)=>{
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {    
            var response = xhr.responseText;
            // console.log(response);
            try {
              let responseObj = JSON.parse(response);
              if (responseObj && responseObj.code == 1) {
                resolve(responseObj);
              } else if (responseObj && responseObj.msg) {
                reject(responseObj.msg);
              } else {
                reject('请求失败：' + xhr.status);
              }
            } catch (err) {
              reject(err);
            }
          }
      };
      xhr.onerror = (error)=>{
        reject();
      };
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      let requestData = this.queryParams(params, false);
      console.log("XMLHttpRequest url:" + url);
      console.log("XMLHttpRequest data:" + requestData);
      xhr.send(requestData);
    });
  },
  // 拼接请求参数
  queryParams(data, isPrefix) {
    isPrefix = isPrefix ? isPrefix : false;
    let prefix = isPrefix ? "?" : "";
    let _result = [];
    for (let key in data) {
      let value = data[key];
      // 去掉为空的参数
      if (["", undefined, null].includes(value)) {
        continue;
      }
      if (value.constructor === Array) {
        value.forEach(_value => {
          _result.push(
            encodeURIComponent(key) + "[]=" + encodeURIComponent(_value)
          );
        });
      } else {
        _result.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }
    return _result.length ? prefix + _result.join("&") : "";
  },
  // 请求sessionKey
  WXRequestSessionKey(code) {
    return new Promise((r, j)=>{
      this.XMLHttpRequest(JZZC_AUTHOR_URL, {code: code, appId: JZZC_APP_ID})
      .then((responseObj)=>{
        r(responseObj.data);
      })
      .catch(()=>{
        j();
      });
    });
  },
  // 加载远程用户游戏信息
  uploadUserGameInfo(param) {
    return new Promise((r, j)=>{
      this.XMLHttpRequest(JZZC_CURRENT_GAME_ROOT_URL + "/create", param)
      .then((responseObj)=>{
        r(responseObj.data);
      })
      .catch(()=>{
        j();
      });
    });
  },
  // 获取世界排  page 0  size
  loadWorldRanking (page, size, orderBy) {
    return new Promise((r, j)=>{
      this.XMLHttpRequest(JZZC_CURRENT_GAME_ROOT_URL + "/ranking", {
        page: page,
        size: size,
        orderBy: orderBy
      })
      .then((responseObj)=>{
        r(responseObj.data);
      })
      .catch(()=>{
        j();
      });
    });
  },
  // 获取服务器时间
  getServerTime () {
    return new Promise((r, j)=>{
      this.XMLHttpRequest(JZZC_ROOT_URL + "/server_time", {})
      .then((responseObj)=>{
        r(responseObj.serverTime);
      })
      .catch(()=>{
        j();
      });
    });
  }
});
module.exports = GameHttpUtil;