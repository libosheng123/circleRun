const resetLocal = false;
var StorageUtil = cc.Class({
  properties: {

  },
  ctor () {

  },
  clearLocalData (key) {
    cc.sys.localStorage.removeItem(key);
  },
  saveLocalData(key, dataObj) {
    if (!dataObj || !key) {
      return;
    }
    let data = dataObj;
    if (typeof data != 'string') {
      data = JSON.stringify(dataObj)
    }
    cc.sys.localStorage.setItem(key, data);
  },
  getLocalData(key) {
    return new Promise((resolve, reject)=> {
      if (resetLocal) {
        cc.sys.localStorage.removeItem(key);
      }
      var data = cc.sys.localStorage.getItem(key);
      console.log(key + ":\n" + data);

      if (typeof data == "string" && data != "") {
        try {
          let obj = JSON.parse(data);
          resolve(obj);
        } catch (error) {
          reject(data);
        }
      } else {
        reject();
      }
    });
  }
});
module.exports = StorageUtil;