cc.Class({
    extends: cc.Component,

    properties: {
        // circle: cc.Node,
        // player: cc.Node,
        // num: 0,
        // rotateSpeed: 10,
        car: [cc.Node]
    },

    ctor() {
        // 圆心
        this.circleCenter = cc.v2(0, 0);

        // 半径
        this.circleRadius = 200;

        // 车速
        this.carSpeed = 100;

        // 角度
        this.circlrAngle = 90;
    },

    onLoad() {
        this.schedule(() => {
            this.circlrAngle -= 10;
            let x = this.circleRadius * Math.cos(this.circlrAngle * (Math.PI / 180)) + this.circleCenter.x;
            let y = this.circleRadius * Math.sin(this.circlrAngle * (Math.PI / 180)) + this.circleCenter.y;
            this.car[0].setPosition(x, y);
            this.car[1].setPosition(x, y);
            cc.log('x = ' + x + '  y = ' + y);
            this.car[0].angle = this.circlrAngle - 90;
            this.car[1].angle = this.circlrAngle - 90;
        }, 1);
    },

    jump() {
        //待调整
        this.circleRadius += 10;
        this.circlrAngle -= 10;
        let x = this.circleRadius * Math.cos(this.circlrAngle * (Math.PI / 180)) + this.circleCenter.x;
        let y = this.circleRadius * Math.sin(this.circlrAngle * (Math.PI / 180)) + this.circleCenter.y;
        this.car[0].runAction(cc.moveTo(1, cc.v2(x, y)));
        this.car[1].runAction(cc.moveTo(1, cc.v2(x, y)));
        cc.log('>>>>')
    },
    // update(dt) {
    // },
});
