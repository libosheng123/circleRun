cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        let sp = this.node.getComponent(cc.Sprite);
        sp.trim = false;
        sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    },

    start() {
        let sfSize = this.node.getComponent(cc.Sprite).spriteFrame.getOriginalSize();
        let spW2H = sfSize.width / sfSize.height;
        let canvasNode = cc.Canvas.instance.node;
        let canvasW2H = canvasNode.width / canvasNode.height;
        if (spW2H > canvasW2H) {
            // 把高度变成和画布一样高
            this.node.height = canvasNode.height;
            this.node.width = canvasNode.height * spW2H;
        } else if (spW2H < canvasW2H) {
            // 把宽度变成和画布一样宽
            this.node.width = canvasNode.width;
            this.node.height = canvasNode.width / spW2H;
        }
    },

    // update (dt) {},
});
