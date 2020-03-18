var GameResourceLoader = cc.Class({
  properties: {},
  ctor() {
  },
  // 加载子包
  loadSubPackage () {
    return new Promise((resolve, reject)=>{
      console.log('开始加载分包...');
      switch (cc.sys.platform) {
        case cc.sys.WECHAT_GAME:
            // this.downloadSubpackage('subPackages')
            // .then(()=>{
            //     console.log('分包加载成功...');
            //     resolve();
            // })
            // .catch(()=>{
            //     console.log('分包加载失败...');
            //     reject();
            // });
            console.log('不需要加载分包');
            resolve();
          break;
        default:
            console.log('不需要加载分包');
            resolve();
          break;
      }
    });
  },
  downloadSubpackage (name) {
    return new Promise((resolve, reject)=>{
      cc.loader.downloader.loadSubpackage(name, (err)=>{
        if (err) {
          console.log("加载子包"+name+"失败" + err);
          reject(err)
        } else {
          console.log('子包'+name+'加载成功');
          resolve();
        }
      });
    });
  },
  // 加载所有图集
  loadAllSpriteAtlas () {
    return new Promise((resolve, reject)=>{
      if (this.allAllSpriteAtlasLoaded) {
        resolve();
      } else {
        let _THIS = this;
        let dir = 'subpackage/SpriteAtlas';
        console.log('开始加载' + dir);
        cc.loader.loadResDir(dir, cc.SpriteAtlas, function (err, assets, urls) {
          if (err) {
            console.log('加载' + dir + '失败' + err);
            reject(err);
          } else {
            console.log('加载' + dir + '成功：\n' + JSON.stringify(urls));
            _THIS.allAllSpriteAtlasLoaded = true;
            for (let i=0; i<urls.length; i++) {
              _THIS[urls[i]] = assets[i];
            }
            resolve();
          }
        });
      }
    });
  },
  // 加载所有帧图
  loadAllSpriteFrame () {
    return new Promise((resolve, reject)=>{
      if (this.allSpriteFrameLoaded) {
        resolve();
      } else {
        let _THIS = this;
        let dir = 'subpackage/spriteFrames';
        console.log('开始加载' + dir);
        cc.loader.loadResDir(dir, cc.SpriteFrame, function (err, assets, urls) {
          if (err) {
            console.log('加载' + dir + '失败' + err);
            reject(err);
          } else {
            console.log('加载' + dir + '成功：\n' + JSON.stringify(urls));
            _THIS.allSpriteFrameLoaded = true;
            for (let i=0; i<urls.length; i++) {
              _THIS[urls[i]] = assets[i];
            }
            resolve();
          }
        });
      }
    });
  },
  loadSpriteFrame (path) {
    return new Promise((resolve, reject)=>{
      if (this[path]) {
          resolve(this[path]);
      } else {
          console.log('开始加载图片' + path);
          let _THIS = this;
          cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame) => {
              if (err) {
                console.log('加载图片'+ path +'失败'  + err);
                reject(err);
              } else {
                console.log('加载图片'+ path +'成功！');
                _THIS[path] = spriteFrame;
                resolve(_THIS[path]);
              }
          });
      }
    });
  },
  loadSpriteAtlas (path) {
    return new Promise((resolve, reject)=>{
      if (this[path]) {
          resolve(this[path]);
      } else {
          console.log('开始加载图集' + path);
          let _THIS = this;
          cc.loader.loadRes(path, cc.SpriteAtlas, (err, spriteAtlas) => {
              if (err) {
                console.log('加载图集'+ path +'失败'  + err);
                reject(err);
              } else {
                console.log('加载图集'+ path +'成功！');
                _THIS[path] = spriteAtlas;
                resolve(_THIS[path]);
              }
          });
      }
    });
  },
  releaseSpriteAtlas (path) {
    if (this[path]) {
      this[path] = null;
      cc.loader.releaseRes(path, cc.SpriteAtlas);
      console.log('releaseSpriteAtlas ' + path);
    }
  },
  releaseSpriteFrame (path) {
    if (this[path]) {
      this[path] = null;
      cc.loader.releaseRes(path, cc.SpriteFrame);
      console.log('releaseSpriteFrame ' + path);
    }
  }
});

module.exports = GameResourceLoader;
