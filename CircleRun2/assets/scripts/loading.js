cc.Class({
    extends: cc.Component,

    properties: {
        loadingProgress: {
            default: null,
            type: cc.Node
        },
        loadingProgressIndex: {
            default: null,
            type: cc.Sprite
        }
    },

    onLoad() {
        GlobalUtil.init();
    },
    start() {
        this.startLogin();
    },
    startLogin() {
        this.loadingProgress.active = true;
        this.currentStep = 0;
        this.countStep = 5;
        this.loadingProgressIndex.fillRange = 0;

        // 加载本地游戏数据
        Singleton.loadLocalUserGameInfo()
            .then(userGameInfo => {
                console.log('本地用户数据：' + JSON.stringify(userGameInfo));
                this.addStep();
                // 加载子包
                return GameResourceLoader.loadSubPackage();
            })
            .then(() => {
                this.addStep();
                // 加载所有帧图
                GameResourceLoader.loadAllSpriteFrame();
            })
            .then(() => {
                this.addStep();
                // 加载所有图集
                GameResourceLoader.loadAllSpriteAtlas();
            })
            .then(() => {
                this.addStep();
                // 加载游戏界面
                return this.loadGame();
            })
            .then(() => {
                this.addStep(() => {
                    // 进入游戏
                    cc.director.loadScene("gameWorld");
                });
            })
            .catch(() => {
                // 报错
                Singleton.toast('进入游戏失败，请检查网络后重试');
                this.loadingProgressIndex.fillRange = 0;
                this.loadingProgress.active = false;
            });
    },
    addStep(callback) {
        this.currentStep++;
        let progress = this.currentStep / this.countStep;
        this.setProgress(progress, callback);
    },
    setProgress(progress, callback) {
        let currentProgress = this.loadingProgressIndex.fillRange;
        let duration = 1 * (progress - currentProgress) / 1;
        cc.tween(this.loadingProgressIndex)
            .to(duration, { fillRange: progress })
            .call(() => {
                if (callback) {
                    callback();
                }
            })
            .start();
    },
    // 加载游戏
    loadGame() {
        return new Promise((resolve, reject) => {
            console.log('开始加载游戏页...');
            cc.director.preloadScene(
                "gameWorld",
                (completedCount, totalCount, item) => {
                    // let progress = (this.currentStep + completedCount/totalCount)/this.countStep;
                    // this.setProgress(progress);
                },
                (error, asset) => {
                    if (error) {
                        console.log('游戏页加载失败...');
                        setTimeout(() => {
                            reject();
                        }, 88);
                    } else {
                        console.log('游戏页加载成功...');
                        setTimeout(() => {
                            resolve();
                        }, 88);
                    }
                }
            );
        });
    }
});