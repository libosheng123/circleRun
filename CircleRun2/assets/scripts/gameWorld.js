const Types = require('./publicUtils/types');
const GroupType = Types.GroupType;

cc.Class({
    extends: cc.Component,

    properties: {
        topLoop: cc.Node,
        bottomLoop: cc.Node,
        lineLayer: cc.Node,

        scoreNode: cc.Node,//游戏进行中成绩
        score: cc.Node,//首页界面成绩
        gold: cc.Node,//金币

        bg: cc.Node
    },

    ctor() {
        this.scoreNum = 0;//成绩
        this.colorNum = 0;//颜色
        this.goldNum = 0;//金币
    },
    onLoad() {
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;

        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEvent, this);

        //最好的成绩
        this.score.getComponent(cc.Label).string = cc.sys.localStorage.getItem('gameScoreNum')
        this.schedule(this.scheduTime, 1);

        // this.colorgGradient();
    },

    scheduTime() {
        let color = [
            cc.tintTo(0.5, 230, 64, 64),
            cc.tintTo(0.5, 230, 128, 32),
            cc.tintTo(0.5, 230, 230, 32),
            cc.tintTo(0.5, 64, 230, 64),
            cc.tintTo(0.5, 32, 230, 230),
            cc.tintTo(0.5, 64, 64, 230),
            cc.tintTo(0.5, 230, 32, 230)
        ];
        let boolScore = cc.sys.localStorage.getItem('gameScore');
        if (boolScore == 1) {
            this.scoreNum++;
            this.scoreShow(this.scoreNum);
            if (this.scoreNum % 2 == 0) {
                cc.tween(this.bg)
                    .then(color[this.colorNum])
                    .start();
                this.colorNum++;
                if (this.colorNum == color.length) {
                    this.colorNum = 0;
                }
            }
        }

        let boolScoreNum = cc.sys.localStorage.getItem('gameScoreNum');
        if (!boolScoreNum) {
            cc.sys.localStorage.setItem('gameScoreNum', 1);
        }
    },

    start() {
        this.topLoop.loop.game = this;
        this.bottomLoop.loop.game = this;
        this.lineLayer.lineLayer.startEndlessModel();
        this.topLoop.loop.ready();
        this.bottomLoop.loop.ready();
        let goldNum = cc.sys.localStorage.getItem('goldNum');
        if (!goldNum) {
            cc.sys.localStorage.setItem('goldNum', 0);
            this.gold.getComponent(cc.Label).string
                = cc.sys.localStorage.getItem('goldNum');
        } else {
            this.gold.getComponent(cc.Label).string = goldNum;
        }
    },

    onTouchEvent(e) {
        switch (e.type) {
            case cc.Node.EventType.TOUCH_END:
                this.lineLayer.lineLayer.gameStart();
                this.topLoop.loop.jump();
                this.bottomLoop.loop.jump();
                let bool = cc.sys.localStorage.getItem('gameScore');
                if (!bool) {
                    cc.sys.localStorage.setItem('gameScore', 1);
                }
                cc.find('Canvas/banner').active = false;
                break;
        }
    },

    scoreShow(scoreNum) {
        this.scoreNode.active = true;
        this.scoreNode.getComponent(cc.Label).string = scoreNum;
    },
    //渐变
    colorgGradient() {
        let b = this.bg.color.b;
        let g = this.bg.color.g;
        let r = this.bg.color.r;
        let lineLayerChild = cc.find('Canvas/collide/lineLayer').children;
        // for (let i = 0; i < lineLayerChild.length; i++) {
        //     lineLayerChild[i].runAction(cc.tintTo(0.5, b, g, r));
        // }
        cc.log(lineLayerChild.length, ' :长度')
    },

    gameOver() {
        this.topLoop.loop.stopJump();
        this.bottomLoop.loop.stopJump();
        this.lineLayer.lineLayer.gameOver();
        //保存分数
        let gameScoreNum = cc.sys.localStorage.getItem('gameScoreNum');
        if (gameScoreNum < this.scoreNum) cc.sys.localStorage.setItem('gameScoreNum', this.scoreNum);
        cc.sys.localStorage.removeItem('gameScore');
        this.unschedule(this.scheduTime);

        cc.find('Canvas/scoreOrreplay').active = true;
        cc.find('Canvas/scoreOrreplay/scorebg/score').getComponent(cc.Label).string = this.scoreNum;
    },

    onCollisionEnter(other, self) {
        switch (self.tag) {
            case 3:
                if (other.node.group == GroupType.group_gold) {
                    other.node.gold.goldRecycle();
                    let addGold = cc.sys.localStorage.getItem('goldNum');
                    let goldSum = JSON.parse(addGold) + 1;
                    cc.sys.localStorage.setItem('goldNum', goldSum)
                }
                break;
        }
    },

    onCollisionExit(other, self) {
        switch (self.tag) {
            case 1:
                if (other.node.group == GroupType.group_line) {
                    other.node.line.lineRecycle();
                }
                break;
            case 2:
                if (other.node.group == GroupType.group_line) {
                    this.lineLayer.lineLayer.tryMakeNextLine();
                }
                break;
        }

    },

    rePlay() {
        cc.director.loadScene('gameWorld');
    },

    storageInit() {

    },

    update(dt) {

    },
});
