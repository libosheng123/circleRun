let Config = require("Config");
cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: cc.Node,
        wheelSp: cc.Node,
        goldNum: cc.Label,
    },

    ctor() {
        this.wheelState = 0;//轮盘状态:0 静止 1 转动
        this.turnsNum = 3;//固定转六圈不减速,之后开始减速直到转到目标
        this.curSpeed = 400;//当前速度
        this.speedCut = 0.5;//减速
        this.gearAngle = 45;//每个齿轮的角度
    },
    onLoad() {
        this.spinBtn.on('touchstart', () => {
            this.wheelState = 1;
        });
        this.randSpeedCut = Math.floor(Math.random() * 10 + 1);
        this.goldNum.string = cc.sys.localStorage.getItem('goldNum');
    },

    update(dt) {
        if (this.wheelState === 0) {
            return;
        }
        if (this.wheelState == 1) {
            this.spinTime += dt;
            this.wheelSp.angle += this.curSpeed * dt;
            if (this.wheelSp.angle >= this.turnsNum * 360) {
                this.curSpeed -= this.randSpeedCut;
                if (this.curSpeed <= 0) {
                    let turnsAngle = parseInt((this.wheelSp.angle - parseInt(this.wheelSp.angle / 360) * 360) / this.gearAngle);
                    cc.log(parseInt(Config.gearInfo[turnsAngle]));
                    this.wheelState = 0;
                }
            }
        }
    },
});