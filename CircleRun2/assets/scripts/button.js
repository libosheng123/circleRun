cc.Class({
    extends: cc.Component,

    properties: {
        collide: cc.Node,//玩法界面
        skin: cc.Node,//皮肤界面
        banner: cc.Node,//选择界面
        turnTable: cc.Node,//转盘界面
    },

    onLoad() { },

    skinOpen() {
        this.collide.active = false;
        this.banner.active = false;
        this.skin.active = true;
    },

    turnTableOpen() {
        this.skin.active = false;
        this.turnTable.active = true;
    },

    backCollide() {
        this.skin.active = false;
        this.collide.active = true;
        this.banner.active = true;
    },

    enterPattern() {
        cc.director.loadScene('map');
    }
});
