cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {
        if (typeof tt != "undefined") {
            this.node.active = false;
        }
    },

    clickShareGame() {
        ShareUtil.onShare();
    }

    // update (dt) {},
});
