cc.Class({
    extends: cc.Component,

    properties: {
        titleLabel: cc.Label
    },
    onLoad() {
    },

    start() {
        cc.game.addPersistRootNode(this.node);
        this.node.scale = 0;
        this.node.active = false;
        Singleton.toastUtil = this;
    },
    /**
     * 弹消息
     * @param {String} msg  消息
     * @param {Number} duration 毫秒
     */
    showToast(msg, duration) {
        this.node.x = cc.Canvas.instance.node.width * 0.5;
        this.node.y = cc.Canvas.instance.node.height * 0.5 + 550;
        this.titleLabel.string = msg;
        this.node.width = msg.length * (this.titleLabel.fontSize + 1) + 80;
        if (duration) {
            this.duration = duration / 1000;
        } else {
            this.duration = 1.2;
        }
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
        this._animateShow();
        this.scheduleOnce(() => {
            this._animateClose();
        }, this.duration);
    },
    _animateShow() {
        this.node.active = true;
        let duration = 0.1 * (1 - this.node.scale);
        cc.tween(this.node)
            .to(duration, { scale: 1 })
            .call(() => {
                this._alertShowed();
            })
            .start();
    },
    _alertShowed() {
    },
    _animateClose() {
        cc.tween(this.node)
            .to(0.1, { scale: 0 })
            .call(() => {
                this._alertClosed();
            })
            .start();
    },
    _alertClosed() {
        this.node.active = false;
    },
    // update (dt) {},
});
