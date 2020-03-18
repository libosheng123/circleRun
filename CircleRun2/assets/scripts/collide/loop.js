cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.node.loop = this;
    },

    start() {

    },
    // 预备
    ready() {
        this.node.y = 0;
        // 悬浮动画
        let levitationH = 15;
        let duration = 0.6;

        let levitationT = cc.tween()
            .by(duration, { position: cc.v2(0, levitationH) }, { easing: 'sineOut' })
            .by(duration, { position: cc.v2(0, -levitationH) }, { easing: 'sineIn' })
            .by(duration, { position: cc.v2(0, -levitationH) }, { easing: 'sineOut' })
            .by(duration, { position: cc.v2(0, levitationH) }, { easing: 'sineIn' });
        // .to(duration, { anchorX: 0.5, anchorY: -3 }, { easing: 'sineOut' })
        // .to(duration, { anchorX: 0.5, anchorY: -2.2 }, { easing: 'sineIn' })
        // .to(duration, { anchorX: 0.5, anchorY: -2.2 }, { easing: 'sineIn' })
        // .to(duration, { anchorX: 0.5, anchorY: -3 }, { easing: 'sineOut' })

        cc.tween(this.node)
            .then(levitationT)
            .repeatForever()
            .start();
    },

    onCollisionEnter(other, self) {
        this.game.gameOver();
    },

    stopJump() {
        this.node.stopAllActions();
    },

    jump() {
        this.node.stopAllActions();
        // cc.tween(this.node)
        //     .to(0.33, { anchorX: 0.5, anchorY: -3 }, { easing: 'sineOut' })
        //     .to(0.33, { anchorX: 0.5, anchorY: -2.2 }, { easing: 'sineIn' })
        //     .to(1, { anchorX: 0.5, anchorY: 0 })
        //     .start();
        cc.tween(this.node)
            .by(0.33, { position: cc.v2(0, 50) }, { easing: 'sineOut' })
            .by(0.33, { position: cc.v2(0, -50) }, { easing: 'sineIn' })
            .by(1, { position: cc.v2(0, -200) })
            .start();
    },
});
