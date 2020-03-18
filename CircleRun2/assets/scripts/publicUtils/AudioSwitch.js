cc.Class({
    extends: cc.Component,

    properties: {
        openSpF: cc.SpriteFrame,
        closeSpF: cc.SpriteFrame
    },

    // onLoad () {},

    start() {
        this.updateSwitch();
    },
    updateSwitch() {
        if (AudioUtil.musicOpen) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.openSpF;
        } else {
            this.node.getComponent(cc.Sprite).spriteFrame = this.closeSpF;
        }
    },
    switchAudioState() {
        AudioUtil.changeSoundState();
        AudioUtil.changeMusicState();
        this.updateSwitch();
    }

    // update (dt) {},
});
