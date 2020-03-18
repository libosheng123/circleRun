const GameModel = cc.Enum({
    GameModel_None: 0,
    GameModel_Endless: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        gameModel: GameModel.GameModel_None
    },


    onLoad() {
        this.node.lineLayer = this;
    },

    start() {

    },

    // 开始无尽模式
    startEndlessModel() {
        this.node.x = 0;
        this.gameModel = GameModel.GameModel_Endless;
        this.moveSpeed = 0;
        this.tryMakeNextLine();
    },

    gameStart() {
        this.moveSpeed = 200;
        cc.sys.localStorage.setItem('gameStart', 1);
    },

    gameOver() {
        this.moveSpeed = 0;
        this.gameModel = GameModel.GameModel_None;
    },

    tryMakeNextLine() {
        let linePrefab = this.node.nodePoolUtil.getPrefab('linePrefab');
        if (!this.lastLine) {
            linePrefab.setPosition(cc.v2(-375, 0));
            linePrefab.angle = 0;
            linePrefab.getComponent('linePrefab').length = 800;
        } else {
            //线
            linePrefab.setPosition(
                this.node.convertToNodeSpaceAR(
                    this.lastLine.convertToWorldSpaceAR(
                        cc.v2(this.lastLine.width - this.lastLine.height * 0.5, 0))));

            linePrefab.angle = -15 + Math.random() * 30;
            linePrefab.getComponent('linePrefab').length = 200;
        }
        linePrefab.parent = this.node;
        this.lastLine = linePrefab;
    },
    tryMakeNextGold() {
        let goldNode = cc.find('Canvas/collide/gold');
        let goldPrefab = goldNode.nodePoolUtil.getPrefab('goldPrefab');
        if (!this.lastLine) {
            linePrefab.setPosition(cc.v2(-375, 0));
            goldPrefab.setPosition(cc.v2(0, 50));
            linePrefab.angle = 0;
            linePrefab.getComponent('linePrefab').length = 800;
        } else {
            //线
            linePrefab.setPosition(
                this.node.convertToNodeSpaceAR(
                    this.lastLine.convertToWorldSpaceAR(
                        cc.v2(this.lastLine.width - this.lastLine.height * 0.5, 0))));

            linePrefab.angle = -15 + Math.random() * 30;
            linePrefab.getComponent('linePrefab').length = 200;

            //金币
            goldPrefab.setPosition(
                this.node.convertToNodeSpaceAR(
                    this.lastLine.convertToWorldSpaceAR(
                        cc.v2(250, 50))));
        }
        linePrefab.parent = this.node;
        this.lastLine = linePrefab;
        goldPrefab.parent = goldNode;
        this.lastGold = goldPrefab;
    },

    update(dt) {
        switch (this.gameModel) {
            case GameModel.GameModel_None:
                break;
            case GameModel.GameModel_Endless:
                this.node.x -= dt * this.moveSpeed;
                cc.find('Canvas/collide/gold').x -= dt * this.moveSpeed;
                break;
        }
    },
});
